import { useState, useEffect } from "react";
import { buscarSessoes, buscarResultados, gerarCSV } from "./dados";
import { botaoPrimario, botaoSecundario } from "./estilos";

function baixarCSV(nome, conteudo) {
  const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nome;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtData(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}

const card = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "14px",
  padding: "16px"
};

function PainelAdmin({ onJogar, onSair }) {
  const [sessoes, setSessoes] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregar() {
    setErro("");
    try {
      const [s, r] = await Promise.all([buscarSessoes(), buscarResultados()]);
      setSessoes(s);
      setResultados(r);
    } catch (e) {
      setErro(e?.message || "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const concluidas = sessoes.filter((s) => s.concluido).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        boxSizing: "border-box",
        background: "linear-gradient(to bottom, #020617, #0f172a)",
        color: "#e2e8f0",
        fontFamily: "system-ui, sans-serif",
        padding: "24px"
      }}
    >
      {/* topo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px"
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.6rem" }}>🛠️ Painel do Administrador</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={botaoSecundario} onClick={carregar}>
            ↻ Atualizar
          </button>
          <button style={botaoSecundario} onClick={onJogar}>
            🎮 Testar jogos
          </button>
          <button
            style={{ ...botaoSecundario, background: "#7f1d1d" }}
            onClick={onSair}
          >
            Sair
          </button>
        </div>
      </div>

      {erro && (
        <div
          style={{
            ...card,
            borderColor: "rgba(248,113,113,0.5)",
            color: "#fca5a5",
            marginBottom: "16px"
          }}
        >
          ⚠️ {erro}
          <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "6px" }}>
            Se for erro de permissão, confirme que o RLS de leitura para
            administradores foi criado (ver docs/supabase.sql).
          </div>
        </div>
      )}

      {/* resumo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "12px",
          marginBottom: "20px"
        }}
      >
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Sessões</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{sessoes.length}</div>
        </div>
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Concluídas</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{concluidas}</div>
        </div>
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Jogos registrados</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{resultados.length}</div>
        </div>
      </div>

      {/* export */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        <button
          style={botaoPrimario}
          onClick={() => baixarCSV("sessoes.csv", gerarCSV(sessoes))}
          disabled={sessoes.length === 0}
        >
          ⬇ Sessões (CSV)
        </button>
        <button
          style={botaoPrimario}
          onClick={() => baixarCSV("resultados.csv", gerarCSV(resultados))}
          disabled={resultados.length === 0}
        >
          ⬇ Resultados por jogo (CSV)
        </button>
      </div>

      {/* tabela de sessões */}
      <div style={{ ...card, padding: 0, overflow: "auto" }}>
        {carregando ? (
          <div style={{ padding: "20px", opacity: 0.7 }}>Carregando…</div>
        ) : sessoes.length === 0 ? (
          <div style={{ padding: "20px", opacity: 0.7 }}>
            Nenhuma sessão registrada ainda.
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ textAlign: "left", opacity: 0.7 }}>
                <th style={{ padding: "10px 12px" }}>Código</th>
                <th style={{ padding: "10px 12px" }}>Data</th>
                <th style={{ padding: "10px 12px" }}>Consentiu</th>
                <th style={{ padding: "10px 12px" }}>Pré</th>
                <th style={{ padding: "10px 12px" }}>Pós</th>
                <th style={{ padding: "10px 12px" }}>Concluído</th>
              </tr>
            </thead>
            <tbody>
              {sessoes.map((s) => (
                <tr key={s.id} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.codigo}</td>
                  <td style={{ padding: "10px 12px", opacity: 0.85 }}>{fmtData(s.criado_em)}</td>
                  <td style={{ padding: "10px 12px" }}>{s.consentiu ? "Sim" : "Não"}</td>
                  <td style={{ padding: "10px 12px" }}>{s.pre_score ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{s.pos_score ?? "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{s.concluido ? "✅" : "⏳"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PainelAdmin;
