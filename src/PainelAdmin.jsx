import { useState, useEffect } from "react";
import {
  buscarSessoes,
  buscarResultados,
  buscarCodigos,
  gerarCodigos,
  gerarCSV,
  gerarCSVAchatado
} from "./dados";
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
  const [codigos, setCodigos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [qtdGerar, setQtdGerar] = useState(10);
  const [gerando, setGerando] = useState(false);

  async function carregar() {
    setErro("");
    try {
      const [s, r, c] = await Promise.all([
        buscarSessoes(),
        buscarResultados(),
        buscarCodigos()
      ]);
      setSessoes(s);
      setResultados(r);
      setCodigos(c);
    } catch (e) {
      setErro(e?.message || "Erro ao carregar os dados.");
    } finally {
      setCarregando(false);
    }
  }

  async function gerar() {
    setGerando(true);
    setErro("");
    try {
      await gerarCodigos(Math.max(1, Math.min(500, Number(qtdGerar) || 0)));
      const c = await buscarCodigos();
      setCodigos(c);
    } catch (e) {
      setErro(e?.message || "Erro ao gerar códigos.");
    } finally {
      setGerando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const concluidas = sessoes.filter((s) => s.concluido).length;

  // resumo pré/pós (apenas sessões com os dois scores)
  const comScores = sessoes.filter(
    (s) => s.pre_score != null && s.pos_score != null
  );
  const media = (arr, campo) =>
    arr.length === 0
      ? null
      : arr.reduce((a, s) => a + s[campo], 0) / arr.length;
  const mediaPre = media(comScores, "pre_score");
  const mediaPos = media(comScores, "pos_score");
  const ganhoMedio =
    mediaPre != null && mediaPos != null ? mediaPos - mediaPre : null;
  const fmt = (v) => (v == null ? "—" : v.toFixed(1));
  const taxaConclusao =
    sessoes.length === 0
      ? "—"
      : `${Math.round((concluidas / sessoes.length) * 100)}%`;

  const codigosUsados = codigos.filter((c) => c.usado).length;

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
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Conclusão</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{taxaConclusao}</div>
        </div>
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Média pré / pós</div>
          <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>
            {fmt(mediaPre)} → {fmt(mediaPos)}
          </div>
        </div>
        <div style={card}>
          <div style={{ opacity: 0.7, fontSize: "0.8rem" }}>Ganho médio</div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: 700,
              color:
                ganhoMedio == null
                  ? undefined
                  : ganhoMedio > 0
                  ? "#4ade80"
                  : ganhoMedio < 0
                  ? "#f87171"
                  : undefined
            }}
          >
            {ganhoMedio == null ? "—" : `${ganhoMedio > 0 ? "+" : ""}${fmt(ganhoMedio)}`}
          </div>
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
        <button
          style={botaoPrimario}
          onClick={() =>
            baixarCSV("estudo_achatado.csv", gerarCSVAchatado(sessoes, resultados))
          }
          disabled={sessoes.length === 0}
        >
          ⬇ Tudo achatado (CSV)
        </button>
      </div>

      {/* códigos de participação */}
      <div style={{ ...card, marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px"
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>🎟️ Códigos de participação</div>
            <div style={{ opacity: 0.7, fontSize: "0.85rem", marginTop: "2px" }}>
              {codigos.length} gerados · {codigosUsados} usados
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="number"
              min={1}
              max={500}
              value={qtdGerar}
              onChange={(e) => setQtdGerar(e.target.value)}
              style={{
                width: "80px",
                padding: "9px 10px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "#e2e8f0"
              }}
            />
            <button style={botaoSecundario} onClick={gerar} disabled={gerando}>
              {gerando ? "Gerando..." : "Gerar"}
            </button>
            <button
              style={botaoPrimario}
              onClick={() =>
                baixarCSV("codigos.csv", gerarCSV(codigos))
              }
              disabled={codigos.length === 0}
            >
              ⬇ Códigos (CSV)
            </button>
          </div>
        </div>
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
