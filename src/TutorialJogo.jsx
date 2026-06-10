import { botaoPrimario } from "./estilos";

const TUTORIAIS = {
  quiz: {
    titulo: "🕵️ Quiz Hacker",
    fundo: "linear-gradient(to bottom, #020617, #0f172a)",
    cor: "#4ade80",
    corTexto: "#e2e8f0",
    descricao: "Você é um hacker tentando invadir sistemas protegidos por firewalls binários.",
    passos: [
      {
        icone: "🔒",
        texto: "Cada firewall exibe um número binário ou decimal. Você precisa convertê-lo para a forma correta."
      },
      {
        icone: "❤️",
        texto: "Você tem 3 vidas. Cada resposta errada custa uma vida — se acabar, a missão termina."
      },
      {
        icone: "🔥",
        texto: "Acertos consecutivos formam um combo e multiplicam seus pontos. Mantenha a sequência!"
      },
      {
        icone: "🏁",
        texto: "São 8 firewalls no total. Quebre todos para completar a invasão."
      }
    ],
    exemplo: {
      titulo: "Exemplo",
      conteudo: (
        <div style={{ fontFamily: "monospace", textAlign: "center" }}>
          <div style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: "6px" }}>Qual valor decimal foi gerado?</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
            {["1", "0", "1"].map((b, i) => (
              <div key={i} style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", background: b === "1" ? "#16a34a" : "rgba(255,255,255,0.08)", color: b === "1" ? "white" : "#64748b" }}>{b}</div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
            {["4", "5", "6", "7"].map((op) => (
              <div key={op} style={{ padding: "6px 12px", borderRadius: "8px", border: op === "5" ? "1px solid #4ade80" : "1px solid rgba(255,255,255,0.15)", background: op === "5" ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.05)", fontSize: "0.9rem", color: op === "5" ? "#4ade80" : "#94a3b8" }}>{op}</div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#4ade80" }}>1·4 + 0·2 + 1·1 = 5 ✓</div>
        </div>
      )
    }
  },

  infinito: {
    titulo: "📡 Torre da Transmissão",
    fundo: "linear-gradient(to bottom, #020617, #0c1a2e)",
    cor: "#38bdf8",
    corTexto: "#e2e8f0",
    descricao: "A torre de comunicação foi danificada. Energize os módulos binários para restaurar a transmissão.",
    passos: [
      {
        icone: "🔘",
        texto: "Cada módulo mostra um valor-alvo. Ative e desative os interruptores de bits para formar esse número."
      },
      {
        icone: "⚡",
        texto: "Confirme quando o valor dos bits bater com o alvo. Cada módulo correto sobe um andar."
      },
      {
        icone: "⏱",
        texto: "Você tem 30 segundos. Quanto mais andares, mais pontos — não perca tempo!"
      },
      {
        icone: "📈",
        texto: "O desafio fica mais difícil ao longo do tempo, com mais bits disponíveis."
      }
    ],
    exemplo: {
      titulo: "Exemplo",
      conteudo: (
        <div style={{ textAlign: "center", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: "4px" }}>Alvo:</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#38bdf8", marginBottom: "10px" }}>6</div>
          <div style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: "6px" }}>Ative os bits corretos:</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            {[{ peso: 4, ativo: true }, { peso: 2, ativo: true }, { peso: 1, ativo: false }].map(({ peso, ativo }) => (
              <div key={peso} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>{peso}</div>
                <div style={{ width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", background: ativo ? "rgba(56,189,248,0.35)" : "rgba(255,255,255,0.06)", border: ativo ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.15)", color: ativo ? "#38bdf8" : "#64748b" }}>{ativo ? "1" : "0"}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#38bdf8" }}>4 + 2 + 0 = 6 ✓</div>
        </div>
      )
    }
  },

  explorador: {
    titulo: "🧭 Ruínas Binárias",
    fundo: "linear-gradient(to bottom, #0a1a0a, #112211)",
    cor: "#86efac",
    corTexto: "#e2e8f0",
    descricao: "Relíquias digitais estão escondidas nas ruínas. Explore três regiões e recupere-as resolvendo desafios binários.",
    passos: [
      {
        icone: "🗺️",
        texto: "Há 3 regiões para explorar: Floresta dos Bits, Cavernas dos Bytes e Templo da Conversão."
      },
      {
        icone: "🔘",
        texto: "Em cada região, ative os bits certos para formar o valor pedido pela missão."
      },
      {
        icone: "💾",
        texto: "Complete a missão para coletar a relíquia e desbloquear a próxima região."
      },
      {
        icone: "🏆",
        texto: "Explore as três regiões e colete todas as relíquias para concluir a aventura."
      }
    ],
    exemplo: {
      titulo: "Exemplo — Floresta dos Bits",
      conteudo: (
        <div style={{ textAlign: "center", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: "4px" }}>Missão: forme o número</div>
          <div style={{ fontSize: "2.2rem", fontWeight: "bold", color: "#86efac", marginBottom: "10px" }}>3</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
            {[{ peso: 2, ativo: true }, { peso: 1, ativo: true }].map(({ peso, ativo }) => (
              <div key={peso} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "0.72rem", opacity: 0.6 }}>{peso}</div>
                <div style={{ width: "38px", height: "38px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", background: ativo ? "rgba(134,239,172,0.25)" : "rgba(255,255,255,0.06)", border: ativo ? "2px solid #86efac" : "1px solid rgba(255,255,255,0.15)", color: ativo ? "#86efac" : "#64748b" }}>{ativo ? "1" : "0"}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#86efac" }}>2 + 1 = 3 ✓ → relíquia coletada!</div>
        </div>
      )
    }
  },

  construtor: {
    titulo: "🔥 Forja Digital",
    fundo: "linear-gradient(to bottom, #1a0a00, #2a1000)",
    cor: "#fb923c",
    corTexto: "#e2e8f0",
    descricao: "Personagens da comunidade digital precisam da sua ajuda. Forge núcleos de energia combinando potências de 2.",
    passos: [
      {
        icone: "🧩",
        texto: "Você tem 4 componentes: 8, 4, 2 e 1. Cada um pode ser ativado ou não — como bits!"
      },
      {
        icone: "🎯",
        texto: "Selecione os componentes cuja soma seja exatamente o valor de energia pedido pelo personagem."
      },
      {
        icone: "✅",
        texto: "Confirme quando montar o valor correto. Se errar, os componentes são resetados."
      },
      {
        icone: "👥",
        texto: "Há 3 personagens para ajudar. Complete todos para encerrar a missão."
      }
    ],
    exemplo: {
      titulo: "Exemplo",
      conteudo: (
        <div style={{ textAlign: "center", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.82rem", opacity: 0.7, marginBottom: "2px" }}>Robô Zelador precisa de</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#fb923c", marginBottom: "10px" }}>13 unidades</div>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
            {[{ val: 8, ativo: true }, { val: 4, ativo: true }, { val: 2, ativo: false }, { val: 1, ativo: true }].map(({ val, ativo }) => (
              <div key={val} style={{ padding: "8px 14px", borderRadius: "8px", background: ativo ? "rgba(251,146,60,0.3)" : "rgba(255,255,255,0.05)", border: ativo ? "2px solid #fb923c" : "1px solid rgba(255,255,255,0.15)", color: ativo ? "#fb923c" : "#64748b", fontWeight: "bold" }}>{val}</div>
            ))}
          </div>
          <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "#fb923c" }}>8 + 4 + 1 = 13 ✓</div>
        </div>
      )
    }
  }
};

function TutorialJogo({ jogo, onJogar }) {
  const t = TUTORIAIS[jogo];
  if (!t) return null;

  return (
    <div style={{ minHeight: "100vh", background: t.fundo, color: t.corTexto, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "620px" }}>

        <h1 style={{ fontSize: "1.9rem", margin: "0 0 6px", color: t.cor }}>
          {t.titulo}
        </h1>
        <p style={{ margin: "0 0 24px", opacity: 0.8, fontSize: "0.95rem", lineHeight: 1.5 }}>
          {t.descricao}
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          {t.passos.map((p, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px" }}>
              <div style={{ fontSize: "1.3rem", marginBottom: "6px" }}>{p.icone}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9, lineHeight: 1.5 }}>{p.texto}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${t.cor}44`, borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
          <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{t.exemplo.titulo}</div>
          {t.exemplo.conteudo}
        </div>

        <button
          onClick={onJogar}
          style={{ ...botaoPrimario, background: t.cor, color: "#111", fontSize: "1.05rem", padding: "13px 32px", width: "100%" }}
        >
          Jogar!
        </button>
      </div>
    </div>
  );
}

export default TutorialJogo;
