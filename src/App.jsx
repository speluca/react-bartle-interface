import { useState, useEffect } from "react";
import {
  criarSessao,
  registrarRecusa,
  atualizarSessao,
  registrarJogo,
  reenviarPendentes,
  logoutAdmin
} from "./dados";
import Hub from "./Hub";
import PainelAdmin from "./PainelAdmin";
import Quiz from "./Quiz";
import Explorador from "./Explorador";
import Infinito from "./Infinito";
import Construtor from "./Construtor";
import Entrada from "./Entrada";
import Tcle from "./Tcle";
import Demografico from "./Demografico";
import TesteBinario from "./TesteBinario";
import Transicao from "./Transicao";
import Encerramento from "./Encerramento";
import { botaoSecundario } from "./estilos";

// jogos do estudo — a ordem é embaralhada por participante
const JOGOS = ["quiz", "infinito", "explorador", "construtor"];

function embaralhar(arr) {
  const c = [...arr];
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [c[i], c[j]] = [c[j], c[i]];
  }
  return c;
}

function agora() {
  return Date.now();
}

const sessaoInicial = {
  codigo: null,
  iniciadoEm: null,
  consentiu: null,
  demografico: null,
  preScore: null,
  preRespostas: null,
  posScore: null,
  posRespostas: null,
  ordemJogos: [],
  resultados: {}, // métricas por jogo (preenchido na Etapa 2)
  concluido: false
};

function renderJogo(jogo, props) {
  if (jogo === "quiz") return <Quiz {...props} />;
  if (jogo === "infinito") return <Infinito {...props} />;
  if (jogo === "explorador") return <Explorador {...props} />;
  if (jogo === "construtor") return <Construtor {...props} />;
  return null;
}

function App() {
  const [modo, setModo] = useState("entrada"); // entrada | participante | admin
  const [etapa, setEtapa] = useState("tcle"); // sub-fluxo do participante
  const [indiceJogo, setIndiceJogo] = useState(0);
  const [sessao, setSessao] = useState(sessaoInicial);

  const [jogoAdmin, setJogoAdmin] = useState("hub"); // admin: escolha livre

  // reenvia dados pendentes ao carregar e quando a conexão voltar
  useEffect(() => {
    reenviarPendentes();
    window.addEventListener("online", reenviarPendentes);
    return () => window.removeEventListener("online", reenviarPendentes);
  }, []);

  // ---- entrada ----
  function iniciarParticipante(codigo) {
    setSessao({
      ...sessaoInicial,
      codigo,
      iniciadoEm: agora(),
      ordemJogos: embaralhar(JOGOS)
    });
    setIndiceJogo(0);
    setEtapa("tcle");
    setModo("participante");
  }

  function entrarAdmin() {
    setJogoAdmin("painel");
    setModo("admin");
  }

  function voltarAoInicio() {
    setSessao(sessaoInicial);
    setModo("entrada");
  }

  async function sairAdmin() {
    try {
      await logoutAdmin();
    } catch {
      // ignora erro de signOut
    }
    setModo("entrada");
  }

  // ---- fluxo do participante ----
  function aceitarTcle() {
    setSessao((s) => ({ ...s, consentiu: true }));
    // cria a linha da sessão no Supabase (consentimento + ordem dos jogos)
    criarSessao(sessao.codigo, sessao.ordemJogos, true);
    setEtapa("demografico");
  }

  function recusarTcle() {
    setSessao((s) => ({ ...s, consentiu: false }));
    registrarRecusa(sessao.codigo);
    setEtapa("recusou");
  }

  function concluirDemografico(dados) {
    setSessao((s) => ({ ...s, demografico: dados }));
    atualizarSessao(sessao.codigo, { demografico: dados });
    setEtapa("preTeste");
  }

  function concluirPreTeste(score, respostas) {
    setSessao((s) => ({ ...s, preScore: score, preRespostas: respostas }));
    atualizarSessao(sessao.codigo, {
      pre_score: score,
      pre_respostas: respostas
    });
    setEtapa("transicao");
  }

  function concluirJogo(jogo, metricas) {
    setSessao((s) => ({
      ...s,
      resultados: { ...s.resultados, [jogo]: metricas }
    }));
    registrarJogo(sessao.codigo, jogo, metricas);
    if (indiceJogo < sessao.ordemJogos.length - 1) {
      setIndiceJogo((i) => i + 1);
    } else {
      setEtapa("posTeste");
    }
  }

  function concluirPosTeste(score, respostas) {
    const final = {
      ...sessao,
      posScore: score,
      posRespostas: respostas,
      concluido: true
    };
    setSessao(final);
    atualizarSessao(sessao.codigo, {
      pos_score: score,
      pos_respostas: respostas,
      concluido: true
    });
    console.log("Sessão concluída:", final);
    setEtapa("fim");
  }

  // ===== ADMIN =====
  if (modo === "admin") {
    if (jogoAdmin === "painel") {
      return (
        <PainelAdmin
          onJogar={() => setJogoAdmin("hub")}
          onSair={sairAdmin}
        />
      );
    }
    return (
      <div>
        {jogoAdmin === "hub" && (
          <>
            <button
              onClick={() => setJogoAdmin("painel")}
              style={{
                ...botaoSecundario,
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 100
              }}
            >
              ← Painel
            </button>
            <Hub setModo={setJogoAdmin} />
          </>
        )}
        {jogoAdmin !== "hub" &&
          renderJogo(jogoAdmin, {
            modoEstudo: false,
            voltar: () => setJogoAdmin("hub")
          })}
      </div>
    );
  }

  // ===== PARTICIPANTE =====
  if (modo === "participante") {
    if (etapa === "tcle") {
      return <Tcle onAceitar={aceitarTcle} onRecusar={recusarTcle} />;
    }
    if (etapa === "recusou") {
      return <Encerramento recusado onSair={voltarAoInicio} />;
    }
    if (etapa === "demografico") {
      return <Demografico onConcluir={concluirDemografico} />;
    }
    if (etapa === "preTeste") {
      return (
        <TesteBinario
          forma="A"
          titulo="Questionário inicial"
          subtitulo="Responda com o que souber. Não tem problema errar!"
          onConcluir={concluirPreTeste}
        />
      );
    }
    if (etapa === "transicao") {
      return <Transicao onContinuar={() => setEtapa("jogos")} />;
    }
    if (etapa === "jogos") {
      const jogo = sessao.ordemJogos[indiceJogo];
      return renderJogo(jogo, {
        modoEstudo: true,
        aoConcluir: (metricas) => concluirJogo(jogo, metricas)
      });
    }
    if (etapa === "posTeste") {
      return (
        <TesteBinario
          forma="B"
          titulo="Questionário final"
          subtitulo="Quase lá! Responda mais estas perguntas."
          onConcluir={concluirPosTeste}
        />
      );
    }
    if (etapa === "fim") {
      return <Encerramento onSair={voltarAoInicio} />;
    }
  }

  // ===== ENTRADA =====
  return (
    <Entrada onParticipante={iniciarParticipante} onAdmin={entrarAdmin} />
  );
}

export default App;
