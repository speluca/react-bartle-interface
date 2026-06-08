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
  if (op.tipo === "upsertSessao") {
    const { error } = await supabase
      .from("sessao")
      .upsert(op.dados, { onConflict: "codigo" });
    if (error) throw error;
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
    tipo: "upsertSessao",
    dados: { codigo, ordem_jogos: ordemJogos, consentiu }
  });
}

export function registrarRecusa(codigo) {
  return enviar({
    tipo: "upsertSessao",
    dados: { codigo, consentiu: false }
  });
}

export function atualizarSessao(codigo, dados) {
  return enviar({ tipo: "atualizarSessao", codigo, dados });
}

export function registrarJogo(codigo, jogo, metricas) {
  return enviar({ tipo: "registrarJogo", dados: { codigo, jogo, metricas } });
}
