import { useState } from "react";
import Tela from "./Tela";
import { botaoPrimario, botaoDesabilitado } from "./estilos";

const PERGUNTAS = [
  {
    id: "idade",
    label: "Faixa etária",
    opcoes: ["Até 17", "18–24", "25–34", "35–44", "45+"]
  },
  {
    id: "genero",
    label: "Gênero",
    opcoes: ["Feminino", "Masculino", "Outro", "Prefiro não informar"]
  },
  {
    id: "escolaridade",
    label: "Escolaridade",
    opcoes: [
      "Ensino médio",
      "Superior em andamento",
      "Superior completo",
      "Pós-graduação"
    ]
  },
  {
    id: "area",
    label: "Área de formação/estudo",
    opcoes: ["Exatas/Tecnologia", "Saúde", "Humanas", "Outra"]
  },
  {
    id: "frequencia",
    label: "Com que frequência você joga jogos digitais?",
    opcoes: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Diariamente"]
  },
  {
    id: "familiaridade",
    label: "Familiaridade prévia com sistema binário",
    opcoes: ["Nenhuma", "Básica", "Intermediária", "Avançada"]
  }
];

function Demografico({ onConcluir }) {
  const [respostas, setRespostas] = useState({});

  const completo = PERGUNTAS.every((p) => respostas[p.id] !== undefined);

  function escolher(id, opcao) {
    setRespostas((r) => ({ ...r, [id]: opcao }));
  }

  return (
    <Tela largura={680}>
      <h1 style={{ marginTop: 0, fontSize: "1.5rem" }}>Sobre você</h1>
      <p style={{ opacity: 0.75, marginTop: 0 }}>
        Estas informações são anônimas e usadas apenas para análise.
      </p>

      {PERGUNTAS.map((p) => (
        <div key={p.id} style={{ marginBottom: "20px" }}>
          <div style={{ fontWeight: 600, marginBottom: "8px" }}>{p.label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {p.opcoes.map((op) => {
              const ativo = respostas[p.id] === op;
              return (
                <button
                  key={op}
                  onClick={() => escolher(p.id, op)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    border: ativo
                      ? "1px solid #818cf8"
                      : "1px solid rgba(255,255,255,0.18)",
                    background: ativo ? "rgba(129,140,248,0.25)" : "rgba(255,255,255,0.05)",
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
        onClick={() => completo && onConcluir(respostas)}
      >
        Continuar
      </button>
    </Tela>
  );
}

export default Demografico;
