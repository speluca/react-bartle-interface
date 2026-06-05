import { useState } from "react";
import Hub from "./Hub";
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

function renderJogo(jogo, voltar) {
  if (jogo === "quiz") return <Quiz voltar={voltar} />;
  if (jogo === "infinito") return <Infinito voltar={voltar} />;
  if (jogo === "explorador") return <Explorador voltar={voltar} />;
  if (jogo === "construtor") return <Construtor voltar={voltar} />;
  return null;
}

function App() {
  const [modo, setModo] = useState("entrada"); // entrada | participante | admin
  const [etapa, setEtapa] = useState("tcle"); // sub-fluxo do participante
  const [indiceJogo, setIndiceJogo] = useState(0);
  const [sessao, setSessao] = useState(sessaoInicial);

  const [jogoAdmin, setJogoAdmin] = useState("hub"); // admin: escolha livre

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
    setJogoAdmin("hub");
    setModo("admin");
  }

  function voltarAoInicio() {
    setSessao(sessaoInicial);
    setModo("entrada");
  }

  // ---- fluxo do participante ----
  function aceitarTcle() {
    setSessao((s) => ({ ...s, consentiu: true }));
    setEtapa("demografico");
  }

  function recusarTcle() {
    setSessao((s) => ({ ...s, consentiu: false }));
    setEtapa("recusou");
  }

  function concluirDemografico(dados) {
    setSessao((s) => ({ ...s, demografico: dados }));
    setEtapa("preTeste");
  }

  function concluirPreTeste(score, respostas) {
    setSessao((s) => ({ ...s, preScore: score, preRespostas: respostas }));
    setEtapa("transicao");
  }

  function avancarJogo() {
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
    // Etapa 1: sem backend ainda — apenas registra no console para conferência.
    console.log("Sessão concluída:", final);
    setEtapa("fim");
  }

  // ===== ADMIN =====
  if (modo === "admin") {
    return (
      <div>
        {jogoAdmin === "hub" && (
          <>
            <button
              onClick={voltarAoInicio}
              style={{
                ...botaoSecundario,
                position: "fixed",
                top: "16px",
                right: "16px",
                zIndex: 100
              }}
            >
              Sair
            </button>
            <Hub setModo={setJogoAdmin} />
          </>
        )}
        {jogoAdmin !== "hub" &&
          renderJogo(jogoAdmin, () => setJogoAdmin("hub"))}
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
      return renderJogo(jogo, avancarJogo);
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
