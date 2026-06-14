import { useState } from "react";
import Tela from "./Tela";
import { botaoPrimario, botaoDesabilitado } from "./estilos";

const LIKERT = [1, 2, 3, 4, 5];
const LIKERT_ROTULOS = ["Discordo\ntotalmente", "Discordo", "Neutro", "Concordo", "Concordo\ntotalmente"];

const QUESTOES_IMMS = [
  { id: "Q5", categoria: "Relevância", texto: "Ficou claro para mim que o conteúdo das aulas está relacionado às coisas que eu já conhecia." },
  { id: "Q6", categoria: "Relevância", texto: "O conteúdo das aulas é relevante para os meus interesses." },
  { id: "Q7", categoria: "Relevância", texto: "Houve explicações ou exemplos de como as pessoas usam/aplicam o conhecimento desta disciplina." },
  { id: "Q8", categoria: "Relevância", texto: "O conteúdo desta lição será útil para mim." },
  { id: "Q13", categoria: "Satisfação", texto: "Concluir esta lição com sucesso foi importante para mim." },
  { id: "Q14", categoria: "Satisfação", texto: "Concluir os exercícios nesta disciplina me deu uma satisfação de realização." },
  { id: "Q15", categoria: "Satisfação", texto: "Foi por causa do meu esforço pessoal que consegui avançar na aprendizagem, por isso me sinto recompensado." },
  { id: "Q16", categoria: "Satisfação", texto: "Gostei tanto dessa disciplina que gostaria de saber mais sobre ela." },
];

const JOGOS = [
  { id: "infinito", nome: "Torre da Transmissão", emoji: "📡" },
  { id: "explorador", nome: "Ruínas Binárias", emoji: "🧭" },
  { id: "construtor", nome: "Forja Digital", emoji: "🔥" },
];

const QUESTOES_JOGOS = [
  { id: "mais_gostou", texto: "Qual jogo você mais gostou?", tipo: "escolha" },
  { id: "mais_aprendeu", texto: "Em qual jogo você sentiu que aprendeu mais sobre sistemas binários?", tipo: "escolha" },
  { id: "mais_recomendaria", texto: "Qual jogo você recomendaria para outros estudantes aprenderem o conteúdo?", tipo: "escolha" },
  { id: "mais_dificil", texto: "Qual jogo você achou mais desafiador?", tipo: "escolha" },
];

function BotaoLikert({ valor, selecionado, onClick, rotulo }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
      <button
        onClick={() => onClick(valor)}
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: selecionado ? "2px solid #4ade80" : "1px solid rgba(255,255,255,0.2)",
          background: selecionado ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.05)",
          color: selecionado ? "#4ade80" : "#94a3b8",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "0.9rem",
          transition: "0.15s"
        }}
      >
        {valor}
      </button>
      <span style={{ fontSize: "0.65rem", opacity: 0.65, marginTop: "4px", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.2, maxWidth: "54px" }}>
        {rotulo}
      </span>
    </div>
  );
}

function QuestaoLikert({ numero, texto, categoria, valor, onChange }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "10px" }}>
        <span style={{ fontSize: "0.7rem", padding: "2px 7px", borderRadius: "20px", background: categoria === "Relevância" ? "rgba(99,102,241,0.3)" : "rgba(34,197,94,0.25)", color: categoria === "Relevância" ? "#a5b4fc" : "#86efac", whiteSpace: "nowrap" }}>
          {categoria}
        </span>
        <span style={{ fontWeight: 500, fontSize: "0.92rem", lineHeight: 1.45 }}>
          {numero}. {texto}
        </span>
      </div>
      <div style={{ display: "flex", gap: "6px", justifyContent: "space-between" }}>
        {LIKERT.map((v, i) => (
          <BotaoLikert
            key={v}
            valor={v}
            selecionado={valor === v}
            onClick={onChange}
            rotulo={i === 0 || i === 4 ? LIKERT_ROTULOS[i] : ""}
          />
        ))}
      </div>
    </div>
  );
}

function QuestaoJogo({ texto, valor, onChange }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ fontWeight: 500, fontSize: "0.92rem", marginBottom: "10px", lineHeight: 1.45 }}>
        {texto}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {JOGOS.map((j) => {
          const ativo = valor === j.id;
          return (
            <button
              key={j.id}
              onClick={() => onChange(j.id)}
              style={{
                padding: "10px 12px",
                borderRadius: "10px",
                border: ativo ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.15)",
                background: ativo ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.05)",
                color: ativo ? "#4ade80" : "#e2e8f0",
                cursor: "pointer",
                fontSize: "0.88rem",
                fontWeight: ativo ? 600 : 400,
                textAlign: "left",
                transition: "0.15s"
              }}
            >
              {j.emoji} {j.nome}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AvaliacaoIMMS({ onConcluir }) {
  const [imms, setImms] = useState({});
  const [jogos, setJogos] = useState({});

  const totalIMMS = QUESTOES_IMMS.length;
  const totalJogos = QUESTOES_JOGOS.length;
  const respondeuIMMS = Object.keys(imms).length === totalIMMS;
  const respondeuJogos = Object.keys(jogos).length === totalJogos;
  const completo = respondeuIMMS && respondeuJogos;

  function setImmsQ(id, val) {
    setImms((prev) => ({ ...prev, [id]: val }));
  }

  function setJogoQ(id, val) {
    setJogos((prev) => ({ ...prev, [id]: val }));
  }

  function finalizar() {
    if (!completo) return;
    onConcluir({ imms, jogos });
  }

  let numGlobal = 0;

  return (
    <Tela largura={700}>
      <h1 style={{ marginTop: 0, fontSize: "1.4rem" }}>Avaliação da experiência</h1>
      <p style={{ opacity: 0.75, marginTop: 0, marginBottom: "24px", fontSize: "0.9rem" }}>
        Indique seu grau de concordância com cada afirmação (1 = discordo totalmente, 5 = concordo totalmente).
      </p>

      {["Relevância", "Satisfação"].map((cat) => {
        const questoes = QUESTOES_IMMS.filter((q) => q.categoria === cat);
        return (
          <div key={cat} style={{ marginBottom: "28px" }}>
            <h2 style={{ fontSize: "1rem", marginBottom: "16px", color: cat === "Relevância" ? "#a5b4fc" : "#86efac", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
              {cat}
            </h2>
            {questoes.map((q) => {
              numGlobal += 1;
              return (
                <QuestaoLikert
                  key={q.id}
                  numero={numGlobal}
                  texto={q.texto}
                  categoria={q.categoria}
                  valor={imms[q.id] ?? null}
                  onChange={(v) => setImmsQ(q.id, v)}
                />
              );
            })}
          </div>
        );
      })}

      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "16px", color: "#fbbf24", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "8px" }}>
          Sobre os jogos
        </h2>
        <p style={{ fontSize: "0.82rem", opacity: 0.6, marginTop: 0, marginBottom: "16px" }}>
          Avalie os jogos que você experimentou durante o estudo.
        </p>
        {QUESTOES_JOGOS.map((q, i) => (
          <QuestaoJogo
            key={q.id}
            texto={`${numGlobal + i + 1}. ${q.texto}`}
            valor={jogos[q.id] ?? null}
            onChange={(v) => setJogoQ(q.id, v)}
          />
        ))}
      </div>

      <button
        style={{ ...(completo ? botaoPrimario : botaoDesabilitado), marginTop: "8px" }}
        disabled={!completo}
        onClick={finalizar}
      >
        Concluir
      </button>
    </Tela>
  );
}

export default AvaliacaoIMMS;
