// Tela de resultado reutilizável pelos jogos (visual unificado, cabe sem rolar).
// Recebe título, subtítulo, cor de destaque, fundo e uma lista de estatísticas.

function ResultadoJogo({
  emoji,
  titulo,
  subtitulo,
  cor = "#4ade80",
  fundo = "linear-gradient(to bottom, #020617, #0f172a)",
  fonte = "system-ui, sans-serif",
  stats = [],
  rotuloBotao,
  onBotao,
  children
}) {
  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: fundo,
        color: "#e2e8f0",
        fontFamily: fonte
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "580px",
          maxHeight: "100%",
          overflow: "auto",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "18px",
          padding: "20px 22px",
          textAlign: "center",
          boxShadow: "0 18px 45px rgba(0,0,0,0.45)"
        }}
      >
        <div style={{ fontSize: "2.3rem", lineHeight: 1 }}>{emoji}</div>

        <h1 style={{ margin: "6px 0 2px", fontSize: "1.35rem", color: cor }}>
          {titulo}
        </h1>

        {subtitulo && (
          <p style={{ opacity: 0.8, margin: "0 0 14px", fontSize: "0.85rem" }}>
            {subtitulo}
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px"
          }}
        >
          {stats.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                padding: "8px 12px",
                textAlign: "left"
              }}
            >
              <div style={{ fontSize: "0.72rem", opacity: 0.7 }}>
                {s.icone} {s.label}
              </div>
              <div
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: cor,
                  marginTop: "1px"
                }}
              >
                {s.valor}
              </div>
            </div>
          ))}
        </div>

        {children && (
          <div style={{ marginTop: "12px", fontSize: "0.85rem" }}>
            {children}
          </div>
        )}

        <button
          onClick={onBotao}
          style={{
            marginTop: "16px",
            width: "100%",
            padding: "12px 18px",
            borderRadius: "11px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "1rem",
            fontFamily: fonte,
            background: cor,
            color: "#0b1020"
          }}
        >
          {rotuloBotao}
        </button>
      </div>
    </div>
  );
}

export default ResultadoJogo;
