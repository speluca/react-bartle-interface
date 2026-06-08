import React, { useState } from "react";
import ResultadoJogo from "./ResultadoJogo";

function Construtor({ voltar, aoConcluir, modoEstudo }) {

  // 🧑‍🤝‍🧑 NPCs da comunidade digital (perfil Socializador)
  const npcs = [
    {
      nome: "Robô Zelador",
      emoji: "🤖",
      artefato: "Drone de Vigilância",
      iconeArtefato: "🛸",
      energia: 13,
      pedido:
        "Olá, engenheiro! Nosso drone de vigilância caiu. Sem ele, a vizinhança fica desprotegida. Pode montar um núcleo de 13 unidades de energia pra mim?",
      agradecimento:
        "Incrível! O drone voltou a voar. A comunidade toda agradece a sua ajuda! 💙"
    },
    {
      nome: "Lumi",
      emoji: "👾",
      artefato: "Lâmpada de Plasma",
      iconeArtefato: "💡",
      energia: 7,
      pedido:
        "Oi! A praça central está às escuras. Se você forjar um núcleo de 7 unidades, eu consigo reacender a lâmpada de plasma e todos poderão se reunir de novo!",
      agradecimento:
        "A praça está iluminada outra vez! Hoje vai ter encontro da galera graças a você. ✨"
    },
    {
      nome: "Mestre Byte",
      emoji: "🧙",
      artefato: "Servidor da Festa",
      iconeArtefato: "🎉",
      energia: 14,
      pedido:
        "Engenheiro, falta só você! Para reativar o servidor da grande festa da comunidade preciso de um núcleo de 14 unidades. Vamos celebrar juntos?",
      agradecimento:
        "O servidor ligou e a festa começou! Toda a comunidade digital está reunida por sua causa. 🎊"
    }
  ];

  // 🔋 componentes baseados em potências de 2
  const componentes = [8, 4, 2, 1];

  const [missaoAtual, setMissaoAtual] = useState(0);
  const [selecionados, setSelecionados] = useState(
    Array(componentes.length).fill(false)
  );
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "ok" | "erro" | ""
  const [jogoFinalizado, setJogoFinalizado] = useState(false);
  const [travado, setTravado] = useState(false); // bloqueia durante a animação de sucesso

  // 📊 dados coletados
  const [artefatosConcluidos, setArtefatosConcluidos] = useState([]);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tentativas, setTentativas] = useState(0);
  const [historicoMissoes, setHistoricoMissoes] = useState([]);
  const [inicioMissao, setInicioMissao] = useState(() => Date.now());

  const npc = npcs[missaoAtual];

  // valor de energia atualmente montado no núcleo
  const valorAtual = selecionados.reduce(
    (soma, ativo, index) =>
      ativo ? soma + componentes[index] : soma,
    0
  );

  const binarioAtual = selecionados
    .map((ativo) => (ativo ? "1" : "0"))
    .join("");

  function toggleComponente(index) {
    if (jogoFinalizado || travado) return;

    const novo = [...selecionados];
    novo[index] = !novo[index];
    setSelecionados(novo);
    setMensagem("");
    setTipoMensagem("");
  }

  // 🔨 forjar o núcleo (tentativa de ativar o artefato)
  function forjar() {
    if (jogoFinalizado || travado) return;

    setTentativas((prev) => prev + 1);

    if (valorAtual === npc.energia) {

      setTravado(true);

      const tempoConstrucao =
        (Date.now() - inicioMissao) / 1000;

      // quantidade mínima de componentes (bits 1 do alvo)
      const bitsNecessarios = npc.energia
        .toString(2)
        .split("")
        .filter((b) => b === "1").length;

      const bitsUsados = selecionados.filter(Boolean).length;

      setAcertos((prev) => prev + 1);

      setArtefatosConcluidos((prev) => [
        ...prev,
        `${npc.iconeArtefato} ${npc.artefato}`
      ]);

      setHistoricoMissoes((prev) => [
        ...prev,
        {
          npc: npc.nome,
          artefato: npc.artefato,
          energia: npc.energia,
          tempo: tempoConstrucao,
          eficiente: bitsUsados === bitsNecessarios
        }
      ]);

      setTipoMensagem("ok");
      setMensagem(`${npc.emoji} ${npc.agradecimento}`);

      setTimeout(() => {
        if (missaoAtual < npcs.length - 1) {
          setMissaoAtual((prev) => prev + 1);
          setSelecionados(Array(componentes.length).fill(false));
          setMensagem("");
          setTipoMensagem("");
          setInicioMissao(Date.now());
          setTravado(false);
        } else {
          setJogoFinalizado(true);
        }
      }, 1500);

    } else {
      setErros((prev) => prev + 1);
      setTipoMensagem("erro");

      if (valorAtual > npc.energia) {
        setMensagem(
          `⚠️ O núcleo tem ${valorAtual} unidades, mas o pedido é ${npc.energia}. Remova alguns componentes.`
        );
      } else {
        setMensagem(
          `⚠️ O núcleo tem só ${valorAtual} unidades. ${npc.nome} precisa de ${npc.energia}. Adicione mais componentes.`
        );
      }
    }
  }

  function limpar() {
    if (jogoFinalizado) return;
    setSelecionados(Array(componentes.length).fill(false));
    setMensagem("");
    setTipoMensagem("");
  }

  // estatísticas derivadas
  const totalTentativas = acertos + erros;

  const precisao =
    totalTentativas === 0
      ? 0
      : Math.round((acertos / totalTentativas) * 100);

  const tempoMedio =
    historicoMissoes.length === 0
      ? 0
      : (
          historicoMissoes.reduce(
            (acc, item) => acc + item.tempo,
            0
          ) / historicoMissoes.length
        ).toFixed(1);

  const solucoesEficientes = historicoMissoes.filter(
    (m) => m.eficiente
  ).length;

  const eficiencia =
    historicoMissoes.length === 0
      ? 0
      : Math.round(
          (solucoesEficientes / historicoMissoes.length) * 100
        );

  // métricas reportadas ao concluir o jogo (estudo)
  const metricas = {
    artefatosConcluidos: artefatosConcluidos.length,
    missoesAtendidas: historicoMissoes.length,
    acertos,
    erros,
    tentativas,
    tempoMedioConstrucao: Number(tempoMedio),
    eficiencia
  };

  // 🏁 TELA FINAL
  if (jogoFinalizado) {
    return (
      <ResultadoJogo
        emoji="🏙️"
        titulo="Comunidade Restaurada"
        subtitulo="Graças à sua ajuda, os personagens estão reunidos novamente!"
        cor="#818cf8"
        fundo="linear-gradient(to bottom, #0f172a, #1e1b4b)"
        stats={[
          { icone: "🛠️", label: "Artefatos", valor: artefatosConcluidos.length },
          { icone: "🤝", label: "Missões", valor: historicoMissoes.length },
          { icone: "✅", label: "Acertos", valor: acertos },
          { icone: "❌", label: "Erros", valor: erros },
          { icone: "🔁", label: "Tentativas", valor: tentativas },
          { icone: "🎯", label: "Precisão", valor: `${precisao}%` },
          { icone: "⏱", label: "Tempo médio", valor: `${tempoMedio}s` },
          { icone: "⚡", label: "Eficiência", valor: `${eficiencia}%` }
        ]}
        rotuloBotao={modoEstudo ? "Continuar →" : "⬅ Voltar ao Hub"}
        onBotao={modoEstudo ? () => aoConcluir(metricas) : voltar}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px",
            padding: "14px 16px",
            textAlign: "left"
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: "6px" }}>
            🏆 Artefatos Restaurados
          </div>
          {artefatosConcluidos.length === 0 ? (
            <p style={{ opacity: 0.7, margin: 0 }}>Nenhum.</p>
          ) : (
            artefatosConcluidos.map((item, index) => (
              <p key={index} style={{ margin: "2px 0" }}>
                {item}
              </p>
            ))
          )}
        </div>
      </ResultadoJogo>
    );
  }

  // 🎮 TELA PRINCIPAL
  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        overflow: "auto",
        background: "linear-gradient(to bottom, #0f172a, #1e1b4b)",
        color: "white",
        padding: "12px 16px"
      }}
    >
      {!modoEstudo && (
        <button
          onClick={voltar}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            marginBottom: "10px",
            fontWeight: "bold",
            background: "white",
            color: "#111"
          }}
        >
          ⬅ Voltar
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr 260px",
          gap: "16px",
          alignItems: "start"
        }}
      >

        {/* COLUNA ESQUERDA — COMUNIDADE */}
        <div>
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              marginBottom: "12px"
            }}
          >
            <h3>🏙️ Comunidade Digital</h3>
            <p style={{ opacity: 0.8, fontSize: "0.85rem" }}>
              Cada vizinho depende de você para restaurar a cidade.
            </p>

            {npcs.map((personagem, index) => {
              const concluida = index < missaoAtual;
              const ativa = index === missaoAtual;

              return (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    marginTop: "8px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    background: ativa
                      ? "#6366f1"
                      : concluida
                      ? "#15803d"
                      : "rgba(255,255,255,0.05)",
                    border: ativa
                      ? "2px solid white"
                      : "2px solid transparent",
                    transition: "0.3s"
                  }}
                >
                  <span style={{ fontSize: "1.5rem" }}>
                    {personagem.emoji}
                  </span>
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {personagem.nome}
                    </div>
                    <div style={{ fontSize: "0.75rem", opacity: 0.85 }}>
                      {concluida
                        ? "✔ Atendido"
                        : ativa
                        ? "⏳ Pedido atual"
                        : "🔒 Aguardando"}
                    </div>
                  </div>
                </div>
              );
            })}

            <div
              style={{
                marginTop: "12px",
                fontSize: "0.8rem",
                opacity: 0.8
              }}
            >
              Missões atendidas: {missaoAtual}/{npcs.length}
            </div>
          </div>
        </div>

        {/* COLUNA CENTRAL — FORJA */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.8rem", margin: "0 0 2px" }}>
            🔥 Forja Digital
          </h1>
          <p style={{ opacity: 0.8, fontSize: "0.85rem", margin: "0 0 12px" }}>
            Monte o núcleo de energia combinando potências de 2 para ativar o
            artefato.
          </p>

          {/* DIÁLOGO DO NPC */}
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(99,102,241,0.18)",
              border: "1px solid rgba(255,255,255,0.15)",
              marginBottom: "12px",
              display: "flex",
              gap: "12px",
              alignItems: "center",
              textAlign: "left"
            }}
          >
            <span style={{ fontSize: "2rem" }}>{npc.emoji}</span>
            <div>
              <strong>{npc.nome}</strong>
              <p style={{ margin: "3px 0 0", opacity: 0.9, fontSize: "0.85rem" }}>
                {npc.pedido}
              </p>
            </div>
          </div>

          {/* ARTEFATO ALVO + NÚCLEO MONTADO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px"
            }}
          >
            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)"
              }}
            >
              <h4 style={{ margin: "0 0 4px" }}>
                {npc.iconeArtefato} {npc.artefato}
              </h4>
              <p style={{ opacity: 0.8, margin: 0, fontSize: "0.8rem" }}>
                Energia necessária
              </p>
              <h1 style={{ fontSize: "2.2rem", margin: "4px 0 0" }}>
                {npc.energia}
              </h1>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)"
              }}
            >
              <h4 style={{ margin: "0 0 4px" }}>🔋 Núcleo Montado</h4>
              <h1
                style={{
                  fontSize: "2.2rem",
                  margin: "4px 0",
                  color:
                    valorAtual === npc.energia
                      ? "#4ade80"
                      : valorAtual > npc.energia
                      ? "#f87171"
                      : "white"
                }}
              >
                {valorAtual}
              </h1>
              <p style={{ opacity: 0.8, margin: 0, fontSize: "0.8rem" }}>
                binário: {binarioAtual}₂
              </p>
            </div>
          </div>

          {/* COMPONENTES (potências de 2) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${componentes.length}, 70px)`,
              justifyContent: "center",
              gap: "12px",
              marginBottom: "14px"
            }}
          >
            {componentes.map((valor, index) => {
              const ativo = selecionados[index];
              return (
                <button
                  key={index}
                  onClick={() => toggleComponente(index)}
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "14px",
                    cursor: "pointer",
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    color: "white",
                    background: ativo
                      ? "linear-gradient(135deg, #818cf8, #4338ca)"
                      : "linear-gradient(135deg, #475569, #1e293b)",
                    border: ativo
                      ? "3px solid #c7d2fe"
                      : "3px solid #1e293b",
                    transform: ativo ? "scale(1.08)" : "scale(1)",
                    boxShadow: ativo
                      ? "0 0 20px rgba(129,140,248,0.7)"
                      : "0 5px 12px rgba(0,0,0,0.35)",
                    transition: "0.25s"
                  }}
                >
                  <div>{valor}</div>
                  <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>
                    {ativo ? "1" : "0"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* AÇÕES */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              marginBottom: "10px"
            }}
          >
            <button
              onClick={forjar}
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                background: "#22c55e",
                color: "white"
              }}
            >
              🔨 Forjar Núcleo
            </button>

            <button
              onClick={limpar}
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                background: "#64748b",
                color: "white"
              }}
            >
              🧹 Limpar
            </button>
          </div>

          {/* FEEDBACK DO NPC */}
          <div style={{ minHeight: "44px" }}>
            <h3
              style={{
                margin: 0,
                animation: "fadeIn 0.5s",
                color:
                  tipoMensagem === "ok"
                    ? "#4ade80"
                    : tipoMensagem === "erro"
                    ? "#fde047"
                    : "white"
              }}
            >
              {mensagem}
            </h3>
          </div>
        </div>

        {/* COLUNA DIREITA — PROGRESSO E DADOS */}
        <div>
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              marginBottom: "12px"
            }}
          >
            <h3>📊 Progresso</h3>
            <p>🛠️ Artefatos concluídos: {artefatosConcluidos.length}</p>
            <p>🤝 Missões atendidas: {missaoAtual}</p>
            <p>✅ Acertos: {acertos}</p>
            <p>❌ Erros: {erros}</p>
            <p>🔁 Tentativas: {tentativas}</p>
          </div>

          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              marginBottom: "12px"
            }}
          >
            <h3>🏆 Artefatos Restaurados</h3>
            {artefatosConcluidos.length === 0 ? (
              <p style={{ opacity: 0.7 }}>Nenhum ainda. Ajude um vizinho!</p>
            ) : (
              artefatosConcluidos.map((item, index) => (
                <p key={index}>{item}</p>
              ))
            )}
          </div>

          <div
            style={{
              padding: "15px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)"
            }}
          >
            <h3>💡 Dica</h3>
            <p style={{ opacity: 0.85, fontSize: "0.9rem" }}>
              Some os componentes (8, 4, 2 e 1) para formar exatamente a energia
              pedida. Cada componente ligado vira um "1" no binário!
            </p>
          </div>
        </div>

      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Construtor;
