import "./App.css";

const modos = [
  {
    id: "quiz",
    perfil: "Competidor",
    titulo: "Quiz Hacker",
    desc: "Quebre firewalls binários e mantenha o combo antes de perder suas vidas.",
    emoji: "🕵️",
    accent: "#f472b6",
    grad: "linear-gradient(135deg, #f472b6, #be123c)"
  },
  {
    id: "infinito",
    perfil: "Conquistador",
    titulo: "Torre da Transmissão",
    desc: "Energize módulos e suba o máximo de andares em 30 segundos.",
    emoji: "📡",
    accent: "#f59e0b",
    grad: "linear-gradient(135deg, #fbbf24, #b45309)"
  },
  {
    id: "explorador",
    perfil: "Explorador",
    titulo: "Ruínas Binárias",
    desc: "Explore regiões, abra portais e descubra relíquias digitais escondidas.",
    emoji: "🧭",
    accent: "#4ade80",
    grad: "linear-gradient(135deg, #4ade80, #15803d)"
  },
  {
    id: "construtor",
    perfil: "Socializador",
    titulo: "Forja Digital",
    desc: "Ajude os personagens montando núcleos de energia e restaure a comunidade.",
    emoji: "🔥",
    accent: "#818cf8",
    grad: "linear-gradient(135deg, #818cf8, #4338ca)"
  }
];

function Hub({ setModo }) {
  return (
    <div className="hub">
      <div className="hub-eyebrow">Aprenda binário jogando</div>
      <h1 className="hub-title">Escolha seu estilo de jogo</h1>
      <p className="hub-sub">
        Quatro cenários inspirados nos perfis de jogador de Bartle. Escolha o
        que combina com você e domine o sistema binário.
      </p>

      <div className="cards">
        {modos.map((m) => (
          <div
            key={m.id}
            className="card"
            style={{ "--accent": m.accent, "--grad": m.grad }}
            onClick={() => setModo(m.id)}
          >
            <div className="card-icon">{m.emoji}</div>
            <span className="card-badge">{m.perfil}</span>
            <h2>{m.titulo}</h2>
            <p>{m.desc}</p>
            <div className="card-arrow">Jogar →</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hub;
