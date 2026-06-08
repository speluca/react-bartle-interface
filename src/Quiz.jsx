import React, { useState, useEffect, useRef } from "react";
import ResultadoJogo from "./ResultadoJogo";

// pesos de um byte (mostramos só os bits usados no desafio)
const PESOS = [128, 64, 32, 16, 8, 4, 2, 1];

// dificuldade leve: começa com 3 bits (até 7) e passa para 4 bits (até 15)
function nivelDeBits(resolvidos) {
  return resolvidos < 3 ? 3 : 4;
}

function paraBinario(n, bits) {
  return n.toString(2).padStart(bits, "0");
}

function embaralhar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// gera 4 alternativas próximas (variando 1 bit), completando se faltar
function gerarVizinhos(valor, bits) {
  const max = (1 << bits) - 1;
  const conjunto = new Set([valor]);

  let tentativas = 0;
  while (conjunto.size < 4 && tentativas < 50) {
    const bit = Math.floor(Math.random() * bits);
    const variacao = valor ^ (1 << bit); // inverte um bit
    if (variacao >= 1 && variacao <= max) {
      conjunto.add(variacao);
    }
    tentativas++;
  }

  // completa com valores aleatórios caso não haja vizinhos suficientes
  while (conjunto.size < 4) {
    conjunto.add(Math.floor(Math.random() * max) + 1);
  }

  return [...conjunto];
}

// cada desafio é um "firewall" a ser quebrado.
// `evitar` = valor do desafio anterior, para não repetir em sequência.
function gerarPergunta(bits, evitar) {
  const max = (1 << bits) - 1;
  const tipo = Math.random() < 0.5 ? "decode" : "encode";

  let valor = Math.floor(Math.random() * max) + 1; // 1..max
  if (evitar !== undefined && max > 1) {
    while (valor === evitar) {
      valor = Math.floor(Math.random() * max) + 1;
    }
  }

  const binario = paraBinario(valor, bits);
  const pesos = PESOS.slice(-bits);

  if (tipo === "decode") {
    // mostra o binário, pergunta o decimal
    return {
      tipo,
      valor,
      binario,
      bits,
      pesos,
      pergunta: "Qual valor decimal foi gerado?",
      opcoes: embaralhar(gerarVizinhos(valor, bits)),
      resposta: valor
    };
  }

  // encode: mostra o decimal, pergunta o binário
  return {
    tipo,
    valor,
    binario,
    bits,
    pesos,
    pergunta: "Qual representação binária corresponde ao valor?",
    opcoes: embaralhar(
      gerarVizinhos(valor, bits).map((v) => paraBinario(v, bits))
    ),
    resposta: binario
  };
}

function Competidor({ voltar, aoConcluir, modoEstudo }) {

  const VIDAS_INICIAIS = 3;
  const TOTAL_FIREWALLS = 8; // limite de desafios por sessão

  const [vidas, setVidas] = useState(VIDAS_INICIAIS);
  const [pontos, setPontos] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maiorStreak, setMaiorStreak] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [temposResposta, setTemposResposta] = useState([]);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  const [pergunta, setPergunta] = useState(() => gerarPergunta(nivelDeBits(0)));
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "ok" | "erro"
  const [erroFlash, setErroFlash] = useState(0); // dispara animação de erro

  const inicioRef = useRef(0);

  // reinicia o cronômetro de resposta sempre que surge uma nova pergunta
  useEffect(() => {
    inicioRef.current = Date.now();
  }, [pergunta]);

  function proximaPergunta(resolvidos) {
    setPergunta(gerarPergunta(nivelDeBits(resolvidos), pergunta.valor));
    setTipoMensagem("");
    setMensagem("");
  }

  function responder(opcao, tempo) {
    if (jogoFinalizado) return;

    setTemposResposta((prev) => [...prev, tempo]);

    const acertou = opcao === pergunta.resposta;
    const resolvidos = acertos + erros + 1; // firewalls enfrentados após este
    const atingiuLimite = resolvidos >= TOTAL_FIREWALLS;

    if (acertou) {
      const novaStreak = streak + 1;

      setStreak(novaStreak);
      setMaiorStreak((m) => Math.max(m, novaStreak));
      setPontos((p) => p + 10 * novaStreak); // combo aumenta a pontuação
      setAcertos((a) => a + 1);

      setTipoMensagem("ok");
      setMensagem(`✔ Firewall quebrado! Combo x${novaStreak}`);

      if (atingiuLimite) {
        setJogoFinalizado(true);
      } else {
        proximaPergunta(resolvidos);
      }
    } else {
      const novasVidas = vidas - 1;

      setVidas(novasVidas);
      setErros((e) => e + 1);
      setStreak(0);
      setTipoMensagem("erro");
      setErroFlash((n) => n + 1); // dispara flash vermelho + tremor

      if (novasVidas <= 0) {
        setMensagem("💀 Sistema bloqueou o acesso!");
        setJogoFinalizado(true);
      } else if (atingiuLimite) {
        setJogoFinalizado(true);
      } else {
        setMensagem(
          `✖ Código incorreto! Era ${
            pergunta.tipo === "decode" ? pergunta.valor : pergunta.binario
          }`
        );
        proximaPergunta(resolvidos);
      }
    }
  }

  // estatísticas
  const totalTentativas = acertos + erros;
  const precisao =
    totalTentativas === 0
      ? 0
      : Math.round((acertos / totalTentativas) * 100);

  const tempoMedio =
    temposResposta.length === 0
      ? 0
      : (
          temposResposta.reduce((acc, t) => acc + t, 0) /
          temposResposta.length
        ).toFixed(1);

  // métricas reportadas ao concluir o jogo (estudo)
  const metricas = {
    acertos,
    erros,
    precisao,
    maiorStreak,
    pontos,
    tempoMedioResposta: Number(tempoMedio),
    totalFirewalls: TOTAL_FIREWALLS,
    venceu: vidas > 0
  };

  // 🏁 TELA FINAL
  if (jogoFinalizado) {
    const venceu = vidas > 0;
    return (
      <ResultadoJogo
        emoji={venceu ? "🏆" : "💀"}
        titulo={venceu ? "Invasão Completa" : "Acesso Bloqueado"}
        subtitulo={
          venceu
            ? "Você quebrou todos os firewalls!"
            : "Suas vidas acabaram — mas olha o seu desempenho."
        }
        cor={venceu ? "#4ade80" : "#f87171"}
        fundo="linear-gradient(to bottom, #020617, #0f172a)"
        fonte="monospace"
        stats={[
          { icone: "🏆", label: "Pontuação", valor: pontos },
          { icone: "🔥", label: "Maior streak", valor: maiorStreak },
          { icone: "✅", label: "Acertos", valor: acertos },
          { icone: "❌", label: "Erros", valor: erros },
          { icone: "🎯", label: "Precisão", valor: `${precisao}%` },
          { icone: "⏱", label: "Tempo médio", valor: `${tempoMedio}s` }
        ]}
        rotuloBotao={modoEstudo ? "Continuar →" : "⬅ Voltar ao Hub"}
        onBotao={modoEstudo ? () => aoConcluir(metricas) : voltar}
      />
    );
  }

  // 🎮 TELA PRINCIPAL (tela única)
  return (
    <div
      style={{
        height: "100vh",
        boxSizing: "border-box",
        overflow: "auto",
        background: "linear-gradient(to bottom, #020617, #0f172a)",
        color: "#e2e8f0",
        padding: "16px",
        fontFamily: "monospace",
        position: "relative"
      }}
    >
      {/* flash vermelho de erro */}
      {erroFlash > 0 && (
        <div
          key={`flash-${erroFlash}`}
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 50,
            background:
              "radial-gradient(circle, rgba(239,68,68,0) 40%, rgba(239,68,68,0.55) 100%)",
            animation: "flashErro 0.45s ease-out"
          }}
        />
      )}

      {!modoEstudo && (
        <button
          onClick={voltar}
          style={{
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            marginBottom: "12px",
            fontWeight: "bold",
            background: "#e2e8f0",
            color: "#111"
          }}
        >
          ⬅ Voltar
        </button>
      )}

      <div
        key={`conteudo-${erroFlash}`}
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          textAlign: "center",
          animation: erroFlash ? "shake 0.4s" : "none"
        }}
      >

        <h1 style={{ fontSize: "1.9rem", margin: "0 0 2px", color: "#4ade80" }}>
          🕵️ Quiz Hacker
        </h1>
        <p style={{ opacity: 0.8, fontSize: "0.85rem", margin: "0 0 14px" }}>
          Invada os sistemas quebrando os firewalls binários.
        </p>

        {/* STATUS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "16px"
          }}
        >
          <div
            style={{
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)"
            }}
          >
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Vidas</div>
            <div style={{ fontSize: "1.3rem" }}>
              {"❤️".repeat(vidas)}
              {"🖤".repeat(VIDAS_INICIAIS - vidas)}
            </div>
          </div>

          <div
            style={{
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)"
            }}
          >
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Pontos</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {pontos}
            </div>
          </div>

          <div
            style={{
              padding: "10px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.06)"
            }}
          >
            <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>Streak</div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              🔥 {streak}
            </div>
          </div>
        </div>

        {/* FIREWALL */}
        <div
          style={{
            padding: "18px",
            borderRadius: "15px",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.3)",
            marginBottom: "16px"
          }}
        >
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "10px" }}>
            🔒 Firewall {acertos + erros + 1}/{TOTAL_FIREWALLS}
          </div>

          {pergunta.tipo === "decode" ? (
            <>
              {/* pesos */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${pergunta.bits}, 1fr)`,
                  gap: "8px",
                  maxWidth: `${pergunta.bits * 64}px`,
                  margin: "0 auto 4px",
                  fontSize: "0.85rem",
                  opacity: 0.7
                }}
              >
                {pergunta.pesos.map((p) => (
                  <div key={p}>{p}</div>
                ))}
              </div>
              {/* bits */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${pergunta.bits}, 1fr)`,
                  gap: "8px",
                  maxWidth: `${pergunta.bits * 64}px`,
                  margin: "0 auto"
                }}
              >
                {pergunta.binario.split("").map((b, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 0",
                      borderRadius: "8px",
                      fontSize: "1.4rem",
                      fontWeight: "bold",
                      background:
                        b === "1" ? "#16a34a" : "rgba(255,255,255,0.06)",
                      color: b === "1" ? "white" : "#64748b"
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <h1 style={{ fontSize: "3rem", margin: "8px 0" }}>
              {pergunta.valor}
            </h1>
          )}

          <p style={{ margin: "14px 0 0", fontSize: "1.05rem" }}>
            {pergunta.pergunta}
          </p>
        </div>

        {/* ALTERNATIVAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "14px"
          }}
        >
          {pergunta.opcoes.map((op, i) => (
            <button
              key={i}
              onClick={() =>
                responder(op, (Date.now() - inicioRef.current) / 1000)
              }
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                cursor: "pointer",
                fontSize: "1.3rem",
                fontWeight: "bold",
                fontFamily: "monospace",
                background: "rgba(255,255,255,0.06)",
                color: "#e2e8f0",
                transition: "0.2s"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(34,197,94,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.06)")
              }
            >
              {op}
            </button>
          ))}
        </div>

        {/* FEEDBACK */}
        <div style={{ minHeight: "32px" }}>
          <h3
            style={{
              margin: 0,
              color:
                tipoMensagem === "ok"
                  ? "#4ade80"
                  : tipoMensagem === "erro"
                  ? "#f87171"
                  : "white"
            }}
          >
            {mensagem}
          </h3>
        </div>

        {/* MINI PLACAR */}
        <div
          style={{
            marginTop: "10px",
            fontSize: "0.85rem",
            opacity: 0.8,
            display: "flex",
            justifyContent: "center",
            gap: "18px"
          }}
        >
          <span>✅ {acertos}</span>
          <span>❌ {erros}</span>
          <span>🎯 {precisao}%</span>
          <span>📈 Melhor streak: {maiorStreak}</span>
        </div>

      </div>

      <style>
        {`
          @keyframes flashErro {
            0% { opacity: 0; }
            25% { opacity: 1; }
            100% { opacity: 0; }
          }

          @keyframes shake {
            0% { transform: translateX(0); }
            15% { transform: translateX(-12px); }
            30% { transform: translateX(10px); }
            45% { transform: translateX(-8px); }
            60% { transform: translateX(6px); }
            75% { transform: translateX(-4px); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Competidor;
