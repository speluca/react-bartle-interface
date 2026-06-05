// Shell visual compartilhado pelas telas do fluxo do estudo (TCLE, questionários, etc.)

function Tela({ children, largura = 600 }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        background:
          "radial-gradient(circle at 20% 15%, rgba(99,102,241,0.22), transparent 45%)," +
          "radial-gradient(circle at 80% 85%, rgba(34,197,94,0.16), transparent 45%)," +
          "linear-gradient(to bottom, #020617, #0f172a 60%, #1e1b4b)"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: largura,
          maxHeight: "90vh",
          overflow: "auto",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "18px",
          padding: "28px 28px 32px",
          textAlign: "left"
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Tela;
