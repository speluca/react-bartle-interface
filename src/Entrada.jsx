import { useState } from "react";
import Tela from "./Tela";
import { botaoPrimario, botaoSecundario, botaoDesabilitado } from "./estilos";
import { loginAdmin, validarCodigo } from "./dados";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.06)",
  color: "#e2e8f0",
  fontSize: "1rem",
  marginTop: "8px"
};

function Entrada({ onParticipante, onAdmin }) {
  const [codigo, setCodigo] = useState("");
  const [mostrarAdmin, setMostrarAdmin] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [verificando, setVerificando] = useState(false);

  async function iniciar() {
    const c = codigo.trim();
    if (!c) {
      setErro("Digite o seu código de participação.");
      return;
    }
    setVerificando(true);
    setErro("");
    const ok = await validarCodigo(c);
    setVerificando(false);
    if (!ok) {
      setErro("Código inválido. Confira com o pesquisador.");
      return;
    }
    onParticipante(c);
  }

  async function entrarAdmin() {
    if (!usuario.trim() || !senha.trim()) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    setEntrando(true);
    setErro("");
    try {
      await loginAdmin(usuario.trim(), senha);
      onAdmin();
    } catch (e) {
      setErro("Login inválido. Verifique e-mail e senha.");
      console.warn("[admin] login falhou:", e?.message || e);
    } finally {
      setEntrando(false);
    }
  }

  return (
    <Tela largura={480}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "2.4rem" }}>🧠💻</div>
        <h1 style={{ margin: "8px 0 4px", fontSize: "1.6rem" }}>
          Estudo: Binário & Estilos de Jogo
        </h1>
        <p style={{ margin: 0, opacity: 0.75, fontSize: "0.9rem" }}>
          Bem-vindo(a)! Informe o seu código para começar.
        </p>
      </div>

      {!mostrarAdmin ? (
        <>
          <label style={{ fontWeight: 600 }}>Código de participação</label>
          <input
            style={inputStyle}
            value={codigo}
            placeholder="ex.: TCC-0001"
            onChange={(e) => {
              setCodigo(e.target.value);
              setErro("");
            }}
            onKeyDown={(e) => e.key === "Enter" && iniciar()}
          />

          {erro && (
            <p style={{ color: "#f87171", fontSize: "0.85rem", margin: "10px 0 0" }}>
              {erro}
            </p>
          )}

          <button
            style={{
              ...(verificando ? botaoDesabilitado : botaoPrimario),
              width: "100%",
              marginTop: "18px"
            }}
            disabled={verificando}
            onClick={iniciar}
          >
            {verificando ? "Verificando..." : "Iniciar"}
          </button>

          <button
            style={{
              ...botaoSecundario,
              width: "100%",
              marginTop: "10px",
              background: "transparent",
              color: "#94a3b8",
              fontWeight: "normal"
            }}
            onClick={() => {
              setMostrarAdmin(true);
              setErro("");
            }}
          >
            Sou administrador
          </button>
        </>
      ) : (
        <>
          <label style={{ fontWeight: 600 }}>E-mail</label>
          <input
            type="email"
            style={inputStyle}
            value={usuario}
            onChange={(e) => {
              setUsuario(e.target.value);
              setErro("");
            }}
          />

          <label style={{ fontWeight: 600, display: "block", marginTop: "14px" }}>
            Senha
          </label>
          <input
            type="password"
            style={inputStyle}
            value={senha}
            onChange={(e) => {
              setSenha(e.target.value);
              setErro("");
            }}
            onKeyDown={(e) => e.key === "Enter" && entrarAdmin()}
          />

          {erro && (
            <p style={{ color: "#f87171", fontSize: "0.85rem", margin: "10px 0 0" }}>
              {erro}
            </p>
          )}

          <button
            style={{
              ...(entrando ? botaoDesabilitado : botaoPrimario),
              width: "100%",
              marginTop: "18px"
            }}
            disabled={entrando}
            onClick={entrarAdmin}
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>

          <button
            style={{
              ...botaoDesabilitado,
              width: "100%",
              marginTop: "10px",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontWeight: "normal"
            }}
            onClick={() => {
              setMostrarAdmin(false);
              setErro("");
            }}
          >
            ← Voltar
          </button>

          <p style={{ opacity: 0.55, fontSize: "0.75rem", marginTop: "16px" }}>
            Acesso restrito a administradores do estudo.
          </p>
        </>
      )}
    </Tela>
  );
}

export default Entrada;
