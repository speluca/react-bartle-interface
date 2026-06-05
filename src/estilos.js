// Estilos compartilhados das telas do fluxo do estudo

export const botaoPrimario = {
  padding: "12px 24px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
  background: "#22c55e",
  color: "white"
};

export const botaoSecundario = {
  ...botaoPrimario,
  background: "#475569"
};

export const botaoDesabilitado = {
  ...botaoPrimario,
  background: "#334155",
  color: "#94a3b8",
  cursor: "not-allowed"
};
