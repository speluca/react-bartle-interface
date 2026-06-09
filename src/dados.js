import { supabase } from "./supabaseClient";

// Persistência da sessão do estudo no Supabase, com buffer offline:
// se um envio falhar (sem internet), a operação fica em localStorage e é
// reenviada depois (no carregamento do app e quando a conexão voltar).

const FILA = "tcc_fila_envios";

function lerFila() {
  try {
    return JSON.parse(localStorage.getItem(FILA)) || [];
  } catch {
    return [];
  }
}

function salvarFila(fila) {
  try {
    localStorage.setItem(FILA, JSON.stringify(fila));
  } catch {
    // ignora se o localStorage estiver indisponível
  }
}

// aplica uma operação diretamente no Supabase (lança erro em caso de falha)
async function aplicar(op) {
  if (op.tipo === "criarSessao") {
    const { error } = await supabase.from("sessao").insert(op.dados);
    // 23505 = código duplicado (sessão já existe, ex.: reteste) → trata como OK
    if (error && error.code !== "23505") throw error;
  } else if (op.tipo === "atualizarSessao") {
    const { error } = await supabase
      .from("sessao")
      .update(op.dados)
      .eq("codigo", op.codigo);
    if (error) throw error;
  } else if (op.tipo === "registrarJogo") {
    const { error } = await supabase.from("resultado_jogo").insert(op.dados);
    if (error) throw error;
  }
}

// tenta enviar; se falhar, enfileira para reenvio posterior
async function enviar(op) {
  try {
    await aplicar(op);
  } catch (e) {
    console.warn("[dados] envio falhou, enfileirando:", e?.message || e);
    const fila = lerFila();
    fila.push(op);
    salvarFila(fila);
  }
}

// reenvia o que ficou pendente na fila
export async function reenviarPendentes() {
  const fila = lerFila();
  if (fila.length === 0) return;

  const restantes = [];
  for (const op of fila) {
    try {
      await aplicar(op);
    } catch {
      restantes.push(op);
    }
  }
  salvarFila(restantes);
}

// ---- API de alto nível (usada pelo App) ----

export function criarSessao(codigo, ordemJogos, consentiu) {
  return enviar({
    tipo: "criarSessao",
    dados: { codigo, ordem_jogos: ordemJogos, consentiu }
  });
}

export function registrarRecusa(codigo) {
  return enviar({
    tipo: "criarSessao",
    dados: { codigo, consentiu: false }
  });
}

export function atualizarSessao(codigo, dados) {
  return enviar({ tipo: "atualizarSessao", codigo, dados });
}

export function registrarJogo(codigo, jogo, metricas) {
  return enviar({ tipo: "registrarJogo", dados: { codigo, jogo, metricas } });
}

// ---- Admin: autenticação ----

export async function loginAdmin(email, senha) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });
  if (error) throw error;
}

export async function logoutAdmin() {
  await supabase.auth.signOut();
}

// ---- Admin: leitura dos dados (exige login + RLS de select) ----

export async function buscarSessoes() {
  const { data, error } = await supabase
    .from("sessao")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function buscarResultados() {
  const { data, error } = await supabase
    .from("resultado_jogo")
    .select("*")
    .order("criado_em", { ascending: false });
  if (error) throw error;
  return data || [];
}

// ---- CSV ----

function valorCSV(v) {
  if (v === null || v === undefined) return "";
  const s = typeof v === "object" ? JSON.stringify(v) : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export function gerarCSV(linhas) {
  if (!linhas || linhas.length === 0) return "";
  const colunas = Array.from(
    linhas.reduce((set, l) => {
      Object.keys(l).forEach((k) => set.add(k));
      return set;
    }, new Set())
  );
  const cabecalho = colunas.join(",");
  const corpo = linhas
    .map((l) => colunas.map((c) => valorCSV(l[c])).join(","))
    .join("\n");
  return `${cabecalho}\n${corpo}`;
}
