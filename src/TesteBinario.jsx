import { useState } from "react";
import Tela from "./Tela";
import { botaoPrimario, botaoDesabilitado } from "./estilos";

// Formas paralelas (mesma dificuldade, valores diferentes).
// `correta` = índice da alternativa correta (oculto do participante).
const FORMAS = {
  A: [
    { p: "Quais algarismos são usados no sistema binário?", opcoes: ["0 e 1", "0 a 9", "1 e 2", "0, 1 e 2"], correta: 0 },
    { p: "Qual o valor decimal de 10₂?", opcoes: ["1", "2", "10", "0"], correta: 1 },
    { p: "Qual o valor decimal de 11₂?", opcoes: ["2", "3", "4", "11"], correta: 1 },
    { p: "Qual é o número 2 em binário?", opcoes: ["10", "01", "11", "00"], correta: 0 },
    { p: "Qual o valor decimal de 101₂?", opcoes: ["4", "5", "6", "101"], correta: 1 },
    { p: "Qual número binário é maior?", opcoes: ["01₂", "11₂", "10₂", "00₂"], correta: 1 }
  ],
  B: [
    { p: "Quantos algarismos diferentes o sistema binário possui?", opcoes: ["2", "8", "10", "16"], correta: 0 },
    { p: "Qual o valor decimal de 01₂?", opcoes: ["1", "2", "10", "0"], correta: 0 },
    { p: "Qual o valor decimal de 100₂?", opcoes: ["3", "4", "5", "100"], correta: 1 },
    { p: "Qual é o número 3 em binário?", opcoes: ["10", "11", "01", "00"], correta: 1 },
    { p: "Qual o valor decimal de 110₂?", opcoes: ["5", "6", "7", "110"], correta: 1 },
    { p: "Qual número binário é maior?", opcoes: ["10₂", "11₂", "01₂", "00₂"], correta: 1 }
  ]
};

function TesteBinario({ forma, titulo, subtitulo, onConcluir }) {
  const questoes = FORMAS[forma];
  const [respostas, setRespostas] = useState(Array(questoes.length).fill(null));

  const completo = respostas.every((r) => r !== null);

  function escolher(qIndex, opIndex) {
    setRespostas((r) => {
      const novo = [...r];
      novo[qIndex] = opIndex;
      return novo;
    });
  }

  function finalizar() {
    if (!completo) return;
    const score = respostas.reduce(
      (acc, escolha, i) => (escolha === questoes[i].correta ? acc + 1 : acc),
      0
    );
    onConcluir(score, respostas);
  }

  return (
    <Tela largura={680}>
      <h1 style={{ marginTop: 0, fontSize: "1.5rem" }}>{titulo}</h1>
      {subtitulo && (
        <p style={{ opacity: 0.75, marginTop: 0 }}>{subtitulo}</p>
      )}

      {questoes.map((q, qi) => (
        <div key={qi} style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>
            {qi + 1}. {q.p}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {q.opcoes.map((op, oi) => {
              const ativo = respostas[qi] === oi;
              return (
                <button
                  key={oi}
                  onClick={() => escolher(qi, oi)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    border: ativo
                      ? "1px solid #4ade80"
                      : "1px solid rgba(255,255,255,0.18)",
                    background: ativo ? "rgba(74,222,128,0.22)" : "rgba(255,255,255,0.05)",
                    color: "#e2e8f0",
                    transition: "0.15s"
                  }}
                >
                  {op}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        style={{ ...(completo ? botaoPrimario : botaoDesabilitado), marginTop: "8px" }}
        disabled={!completo}
        onClick={finalizar}
      >
        Continuar
      </button>
    </Tela>
  );
}

export default TesteBinario;
