import { useState, useEffect, useRef } from "react";
import "./App.css";
import ResultadoJogo from "./ResultadoJogo";

// dificuldade: cada nível tem seus bits e um conjunto de valores possíveis.
// O jogador sobe de nível assim que esgota (sem repetir) os valores do nível.
const niveis = [
  { pesos: [2, 1], valores: [2, 3] },
  { pesos: [4, 2, 1], valores: [4, 5, 6, 7] },
  { pesos: [8, 4, 2, 1], valores: [8, 9, 10, 11, 12, 13, 14, 15] }
];

function sortear(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// calcula o próximo desafio sem repetir valores do nível atual,
// subindo de nível quando todos os valores já foram pedidos
function proximoDesafio(nivelAtual, usadosAtual, alvoAtual) {
  const usadosNovo = usadosAtual.includes(alvoAtual)
    ? usadosAtual
    : [...usadosAtual, alvoAtual];

  const restantes = niveis[nivelAtual].valores.filter(
    (v) => !usadosNovo.includes(v)
  );

  // ainda há valores novos neste nível
  if (restantes.length > 0) {
    const novoAlvo = sortear(restantes);
    return {
      nivel: nivelAtual,
      alvo: novoAlvo,
      usados: [...usadosNovo, novoAlvo]
    };
  }

  // nível esgotado: sobe para o próximo (ou recicla o último)
  const proximoNivel =
    nivelAtual < niveis.length - 1 ? nivelAtual + 1 : nivelAtual;

  const valores =
    proximoNivel === nivelAtual
      ? niveis[proximoNivel].valores.filter((v) => v !== alvoAtual)
      : niveis[proximoNivel].valores;

  const novoAlvo = sortear(valores);

  return {
    nivel: proximoNivel,
    alvo: novoAlvo,
    usados: [novoAlvo]
  };
}

function Infinito({ voltar, aoConcluir, modoEstudo }) {

  const TEMPO_TOTAL = 30; // cronômetro fixo, não pode aumentar
  const ENERGIA_MAX = 10;

  const [andar, setAndar] = useState(0);
  const [andarMaximo, setAndarMaximo] = useState(0);
  const [pontos, setPontos] = useState(0);
  const [energia, setEnergia] = useState(ENERGIA_MAX);
  const [tempo, setTempo] = useState(TEMPO_TOTAL);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  const [nivel, setNivel] = useState(0);
  const [usados, setUsados] = useState([2]); // valores já pedidos no nível atual
  const [alvo, setAlvo] = useState(2);
  const [bits, setBits] = useState([false, false]);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState(""); // "ok" | "erro"

  // 📊 dados coletados
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [maiorSequencia, setMaiorSequencia] = useState(0);
  const [sequenciaAtual, setSequenciaAtual] = useState(0);
  const [modulosConcluidos, setModulosConcluidos] = useState(0);
  const [energiaSoma, setEnergiaSoma] = useState(0);
  const [energiaAmostras, setEnergiaAmostras] = useState(0);

  // ref para amostrar energia no cronômetro sem fechar sobre valor antigo
  const energiaRef = useRef(energia);
  useEffect(() => {
    energiaRef.current = energia;
  }, [energia]);

  const pesos = niveis[nivel].pesos;

  const valorAtual = bits.reduce(
    (soma, ativo, index) => (ativo ? soma + pesos[index] : soma),
    0
  );

  const binarioAtual = bits.map((b) => (b ? "1" : "0")).join("");

  // ⏳ cronômetro fixo + amostragem da energia (para energia média)
  useEffect(() => {
    if (jogoFinalizado) return;

    const intervalo = setInterval(() => {
      setEnergiaSoma((s) => s + energiaRef.current);
      setEnergiaAmostras((n) => n + 1);

      setTempo((prev) => {
        if (prev <= 1) {
          setJogoFinalizado(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [jogoFinalizado]);

  // ⚡ energia diminui gradativamente (não encerra o jogo: sessão é sempre 30s)
  useEffect(() => {
    if (jogoFinalizado) return;

    const intervalo = setInterval(() => {
      setEnergia((e) => Math.max(0, e - 1));
    }, 2500);

    return () => clearInterval(intervalo);
  }, [jogoFinalizado]);

  function toggleBit(index) {
    if (jogoFinalizado) return;
    const novo = [...bits];
    novo[index] = !novo[index];
    setBits(novo);
    setMensagem("");
    setTipoMensagem("");
  }

  // ⚡ energizar módulo (confirmar a representação binária)
  function energizar() {
    if (jogoFinalizado) return;

    if (valorAtual === alvo) {
      const novoAndar = andar + 1;
      const desafio = proximoDesafio(nivel, usados, alvo);

      setAcertos((a) => a + 1);
      setModulosConcluidos((m) => m + 1);
      setPontos((p) => p + 1);
      setEnergia((e) => Math.min(ENERGIA_MAX, e + 1)); // +1 de energia ao acertar

      setAndar(novoAndar);
      setAndarMaximo((max) => Math.max(max, novoAndar));

      setSequenciaAtual((prev) => {
        const nova = prev + 1;
        setMaiorSequencia((m) => Math.max(m, nova));
        return nova;
      });

      setNivel(desafio.nivel);
      setUsados(desafio.usados);
      setAlvo(desafio.alvo);
      setBits(Array(niveis[desafio.nivel].pesos.length).fill(false));

      setTipoMensagem("ok");
      setMensagem("✔ Módulo energizado! Você subiu um andar.");
    } else {
      // erro: não sobe e não recebe energia
      setErros((er) => er + 1);
      setSequenciaAtual(0);
      setTipoMensagem("erro");
      setMensagem(
        valorAtual > alvo
          ? `✖ Valor ${valorAtual} acima do alvo ${alvo}.`
          : `✖ Valor ${valorAtual} abaixo do alvo ${alvo}.`
      );
    }
  }

  // estatísticas derivadas
  const totalTentativas = acertos + erros;
  const precisao =
    totalTentativas === 0
      ? 0
      : Math.round((acertos / totalTentativas) * 100);

  const energiaMedia =
    energiaAmostras === 0
      ? energia
      : (energiaSoma / energiaAmostras).toFixed(1);

  // métricas reportadas ao concluir o jogo (estudo)
  const metricas = {
    acertos,
    erros,
    precisao,
    andarMaximo,
    modulosConcluidos,
    energiaFinal: energia,
    energiaMedia: Number(energiaMedia),
    maiorSequencia,
    tempoSessao: TEMPO_TOTAL
  };

  // 🏁 TELA FINAL
  if (jogoFinalizado) {
    return (
      <ResultadoJogo
        emoji="🏆"
        titulo="Transmissão Restaurada"
        subtitulo="O tempo acabou! Veja o seu desempenho na torre."
        cor="#38bdf8"
        fundo="linear-gradient(to bottom, #0f172a, #1e293b)"
        stats={[
          { icone: "🏢", label: "Andar máximo", valor: andarMaximo },
          { icone: "🧩", label: "Módulos", valor: modulosConcluidos },
          { icone: "✅", label: "Acertos", valor: acertos },
          { icone: "❌", label: "Erros", valor: erros },
          { icone: "🎯", label: "Precisão", valor: `${precisao}%` },
          { icone: "🔥", label: "Maior sequência", valor: maiorSequencia },
          { icone: "⚡", label: "Energia final", valor: `${energia}/${ENERGIA_MAX}` },
          { icone: "📊", label: "Energia média", valor: energiaMedia }
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
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
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
          gridTemplateColumns: "240px 1fr 240px",
          gap: "16px",
          alignItems: "start"
        }}
      >

        {/* COLUNA ESQUERDA — TORRE */}
        <div>
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              marginBottom: "12px",
              textAlign: "center"
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>🏢 Torre</h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column-reverse",
                alignItems: "center",
                gap: "3px",
                minHeight: "160px",
                justifyContent: "flex-start"
              }}
            >
              {[...Array(Math.min(andar, 12))].map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "70px",
                    height: "12px",
                    background: "#38bdf8",
                    border: "1px solid white",
                    borderRadius: "3px"
                  }}
                />
              ))}
              <div
                style={{
                  width: "90px",
                  height: "18px",
                  background: "#64748b",
                  borderRadius: "6px",
                  border: "2px solid white"
                }}
              />
            </div>
            <h2 style={{ margin: "10px 0 0" }}>{andar}</h2>
            <p style={{ margin: 0, opacity: 0.8, fontSize: "0.85rem" }}>
              andares concluídos
            </p>
          </div>

          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)"
            }}
          >
            <h3 style={{ margin: "0 0 6px" }}>⚡ Energia</h3>
            <h2 style={{ margin: "0 0 6px" }}>
              {energia}/{ENERGIA_MAX}
            </h2>
            <div
              style={{
                width: "100%",
                height: "12px",
                background: "#334155",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${(energia / ENERGIA_MAX) * 100}%`,
                  height: "100%",
                  background: "#22c55e",
                  transition: "0.3s"
                }}
              />
            </div>
            <p style={{ margin: "8px 0 0", opacity: 0.75, fontSize: "0.8rem" }}>
              A energia cai com o tempo. Acerte para recuperá-la!
            </p>
          </div>
        </div>

        {/* COLUNA CENTRAL — MÓDULO */}
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: "1.8rem", margin: "0 0 2px" }}>
            📡 Torre da Transmissão
          </h1>
          <p style={{ opacity: 0.8, fontSize: "0.85rem", margin: "0 0 12px" }}>
            Energize o módulo formando o valor em binário e suba o máximo de
            andares em {TEMPO_TOTAL}s.
          </p>

          {/* ALVO + VALOR FORMADO */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "14px"
            }}
          >
            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)"
              }}
            >
              <h4 style={{ margin: "0 0 4px" }}>🎯 Valor Alvo</h4>
              <h1 style={{ fontSize: "2.4rem", margin: 0 }}>{alvo}</h1>
            </div>

            <div
              style={{
                padding: "12px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.08)"
              }}
            >
              <h4 style={{ margin: "0 0 4px" }}>🔢 Valor Formado</h4>
              <h1
                style={{
                  fontSize: "2.4rem",
                  margin: 0,
                  color:
                    valorAtual === alvo
                      ? "#4ade80"
                      : valorAtual > alvo
                      ? "#f87171"
                      : "white"
                }}
              >
                {valorAtual}
              </h1>
              <p style={{ margin: "2px 0 0", opacity: 0.8, fontSize: "0.8rem" }}>
                {binarioAtual}₂
              </p>
            </div>
          </div>

          {/* PESOS DOS BITS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${pesos.length}, 70px)`,
              justifyContent: "center",
              gap: "12px",
              marginBottom: "4px"
            }}
          >
            {pesos.map((peso, index) => (
              <div
                key={index}
                style={{ fontWeight: "bold", fontSize: "1rem", opacity: 0.85 }}
              >
                {peso}
              </div>
            ))}
          </div>

          {/* BITS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${pesos.length}, 70px)`,
              justifyContent: "center",
              gap: "12px",
              marginBottom: "14px"
            }}
          >
            {bits.map((ativo, index) => (
              <button
                key={index}
                onClick={() => toggleBit(index)}
                style={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "white",
                  background: ativo
                    ? "linear-gradient(135deg, #38bdf8, #1d4ed8)"
                    : "linear-gradient(135deg, #475569, #1e293b)",
                  border: ativo ? "3px solid #bae6fd" : "3px solid #1e293b",
                  transform: ativo ? "scale(1.08)" : "scale(1)",
                  boxShadow: ativo
                    ? "0 0 20px rgba(56,189,248,0.7)"
                    : "0 5px 12px rgba(0,0,0,0.35)",
                  transition: "0.25s"
                }}
              >
                {ativo ? "1" : "0"}
              </button>
            ))}
          </div>

          <button
            onClick={energizar}
            style={{
              padding: "12px 28px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.05rem",
              background: "#22c55e",
              color: "white",
              marginBottom: "10px"
            }}
          >
            ⚡ Energizar Módulo
          </button>

          {/* FEEDBACK */}
          <div style={{ minHeight: "40px" }}>
            <h3
              style={{
                margin: 0,
                animation: "fadeIn 0.4s",
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
        </div>

        {/* COLUNA DIREITA — PLACAR */}
        <div>
          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)",
              marginBottom: "12px",
              textAlign: "center"
            }}
          >
            <h3 style={{ margin: "0 0 4px" }}>⏱ Tempo</h3>
            <h1
              style={{
                margin: 0,
                color: tempo <= 10 ? "#f87171" : "white"
              }}
            >
              {tempo}s
            </h1>
            <div
              style={{
                width: "100%",
                height: "10px",
                background: "#334155",
                borderRadius: "10px",
                overflow: "hidden",
                marginTop: "8px"
              }}
            >
              <div
                style={{
                  width: `${(tempo / TEMPO_TOTAL) * 100}%`,
                  height: "100%",
                  background:
                    tempo > 20 ? "#22c55e" : tempo > 10 ? "#f59e0b" : "#ef4444",
                  transition: "1s linear"
                }}
              />
            </div>
          </div>

          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.08)"
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>📊 Placar</h3>
            <p style={{ margin: "4px 0" }}>
              🎚 Nível: {nivel + 1}/{niveis.length}
            </p>
            <p style={{ margin: "4px 0" }}>🏆 Pontos: {pontos}</p>
            <p style={{ margin: "4px 0" }}>🔥 Sequência: {sequenciaAtual}</p>
            <p style={{ margin: "4px 0" }}>📈 Melhor: {maiorSequencia}</p>
            <p style={{ margin: "4px 0" }}>✅ Acertos: {acertos}</p>
            <p style={{ margin: "4px 0" }}>❌ Erros: {erros}</p>
            <p style={{ margin: "4px 0" }}>🎯 Precisão: {precisao}%</p>
          </div>
        </div>

      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default Infinito;
