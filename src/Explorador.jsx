import React, { useState, useEffect } from "react";

function Explorador({ voltar }) {

  const [regiaoAtual, setRegiaoAtual] = useState(1);
  const [desbloqueadas, setDesbloqueadas] = useState([1]);

  const [quantidade, setQuantidade] = useState(4);
  const [partes, setPartes] = useState(Array(4).fill(false));

  const [mensagem, setMensagem] = useState("");
  const [animandoMapa, setAnimandoMapa] = useState(false);

  const [reliquias, setReliquias] = useState([]);
  const [descobertas, setDescobertas] = useState([]);
  const [jogoFinalizado, setJogoFinalizado] = useState(false);

  const historias = {
    1: {
      titulo: "🌿 Floresta das Frações",
      texto:
        "Antigas pedras escondem segredos sobre partes de um todo."
    },

    2: {
      titulo: "❄️ Cavernas Congeladas",
      texto:
        "Cristais antigos preservam proporções esquecidas."
    },

    3: {
      titulo: "🔥 Templo das Proporções",
      texto:
        "A última relíquia guarda o conhecimento final das frações."
    }
  };

  const missoes = {
    1: "Descubra uma fração equivalente a 1/2",
    2: "Ative exatamente metade dos blocos",
    3: "Restaure toda a ruína"
  };

  const nomesReliquias = {
    1: "🌿 Fragmento da Floresta",
    2: "❄️ Cristal Congelado",
    3: "🔥 Chama Antiga"
  };

  // quantidade de peças por região
  useEffect(() => {

    let qtd = 4;

    if (regiaoAtual === 2) qtd = 6;
    if (regiaoAtual === 3) qtd = 8;

    setQuantidade(qtd);
    setPartes(Array(qtd).fill(false));

  }, [regiaoAtual]);

  // lógica principal
  useEffect(() => {

    const total = partes.length;
    const ativas = partes.filter(p => p).length;

    if (ativas === 0) {
      setMensagem("");
      return;
    }

    let texto = `Você descobriu ${ativas}/${total}`;

    // Descobertas matemáticas

    if (ativas === 2 && total === 4) {

      texto += " — equivalente a 1/2 ✨";

      if (!descobertas.includes("2/4 = 1/2")) {
        setDescobertas(prev => [...prev, "2/4 = 1/2"]);
      }
    }

    if (ativas === 3 && total === 6) {

      texto += " — equivalente a 1/2 ✨";

      if (!descobertas.includes("3/6 = 1/2")) {
        setDescobertas(prev => [...prev, "3/6 = 1/2"]);
      }
    }

    if (ativas === 4 && total === 8) {

      texto += " — equivalente a 1/2 ✨";

      if (!descobertas.includes("4/8 = 1/2")) {
        setDescobertas(prev => [...prev, "4/8 = 1/2"]);
      }
    }

    if (ativas === 2 && total === 8) {
      texto += " — equivalente a 1/4 🌙";
    }

    if (ativas === 4 && total === 6) {
      texto += " — equivalente a 2/3 🔥";
    }

    setMensagem(texto);

    // região concluída
    if (ativas === total) {

      setMensagem("🏛️ Ruína restaurada!");

      // ganha relíquia
      if (!reliquias.includes(nomesReliquias[regiaoAtual])) {

        setReliquias(prev => [
          ...prev,
          nomesReliquias[regiaoAtual]
        ]);

      }

      setAnimandoMapa(true);

      setTimeout(() => {

        if (regiaoAtual < 3) {

          const proxima = regiaoAtual + 1;

          setDesbloqueadas(prev => {

            if (!prev.includes(proxima)) {
              return [...prev, proxima];
            }

            return prev;

          });

          setRegiaoAtual(proxima);

        } else {

          setJogoFinalizado(true);

        }

        setAnimandoMapa(false);

      }, 2500);
    }

  }, [partes]);

  function toggleParte(index) {

    const novo = [...partes];

    novo[index] = !novo[index];

    setPartes(novo);

  }

  function temaRegiao() {

    if (regiaoAtual === 1) {
      return {
        fundo: "linear-gradient(to bottom, #0f172a, #1e293b)",
        titulo: "🌿 Floresta das Frações"
      };
    }

    if (regiaoAtual === 2) {
      return {
        fundo: "linear-gradient(to bottom, #1e1b4b, #312e81)",
        titulo: "❄️ Cavernas Congeladas"
      };
    }

    return {
      fundo: "linear-gradient(to bottom, #3f0d12, #a71d31)",
      titulo: "🔥 Templo das Proporções"
    };
  }

  const tema = temaRegiao();

  if (jogoFinalizado) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background: "#0f172a",
          color: "white",
          textAlign: "center",
          padding: "40px"
        }}
      >

        <h1>🏆 RUÍNAS RESTAURADAS</h1>

        <h2>🏺 Relíquias Encontradas</h2>

        {reliquias.map((item, index) => (
          <p key={index}>{item}</p>
        ))}

        <h2 style={{ marginTop: "30px" }}>
          📖 Livro do Explorador
        </h2>

        {descobertas.map((item, index) => (
          <p key={index}>{item}</p>
        ))}

        <h3>
          Descobertas: {descobertas.length}
        </h3>

        <button
          onClick={voltar}
          style={{
            marginTop: "30px",
            padding: "12px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Voltar ao Hub
        </button>

      </div>

    );
  }
  return (
  <div
    style={{
      minHeight: "100vh",
      background: tema.fundo,
      color: "white",
      padding: "20px"
    }}
  >

    <button
      onClick={voltar}
      style={{
        padding: "12px 20px",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        marginBottom: "20px",
        fontWeight: "bold",
        background: "white",
        color: "#111"
      }}
    >
      ⬅ Voltar
    </button>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "250px 1fr 300px",
        gap: "25px",
        alignItems: "start"
      }}
    >

      {/* COLUNA ESQUERDA */}

      <div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "20px"
          }}
        >
          <h3>🏺 Relíquias</h3>

          <div style={{ fontSize: "2rem" }}>
            {reliquias.includes("🌿 Fragmento da Floresta") ? "🌿" : "❔"}{" "}
            {reliquias.includes("❄️ Cristal Congelado") ? "❄️" : "❔"}{" "}
            {reliquias.includes("🔥 Chama Antiga") ? "🔥" : "❔"}
          </div>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)"
          }}
        >
          <h3>🗺️ Mapa</h3>

          {[1, 2, 3].map((regiao) => {

            const desbloqueada =
              desbloqueadas.includes(regiao);

            const ativa =
              regiaoAtual === regiao;

            return (

              <div
                key={regiao}
                onClick={() => {

                  if (desbloqueada) {
                    setRegiaoAtual(regiao);
                  }

                }}
                style={{
                  padding: "12px",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  cursor: desbloqueada
                    ? "pointer"
                    : "not-allowed",

                  background: ativa
                    ? "#22c55e"
                    : desbloqueada
                    ? "#3b82f6"
                    : "#475569",

                  textAlign: "center",

                  fontWeight: "bold"
                }}
              >
                {desbloqueada
                  ? `Região ${regiao}`
                  : "🔒 Bloqueada"}
              </div>

            );

          })}

        </div>

      </div>

      {/* COLUNA CENTRAL */}

      <div
        style={{
          textAlign: "center"
        }}
      >

        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "20px"
          }}
        >
          🧭 Ruínas Matemáticas
        </h1>

        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          {tema.titulo}
        </h2>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              quantidade === 4
                ? "repeat(4, 1fr)"
                : quantidade === 6
                ? "repeat(3, 1fr)"
                : "repeat(4, 1fr)",

            gap: "15px",

            justifyContent: "center",

            maxWidth:
              quantidade === 4
                ? "420px"
                : quantidade === 6
                ? "330px"
                : "430px",

            margin: "0 auto"
          }}
        >

          {partes.map((ativa, index) => (

            <div
              key={index}
              onClick={() => toggleParte(index)}
              style={{
                width: "90px",
                height: "90px",

                background: ativa
                  ? "linear-gradient(135deg, #4ade80, #166534)"
                  : "linear-gradient(135deg, #78716c, #44403c)",

                border: ativa
                  ? "3px solid #bbf7d0"
                  : "3px solid #292524",

                borderRadius: "16px",

                cursor: "pointer",

                transition: "0.3s",

                transform: ativa
                  ? "scale(1.08)"
                  : "scale(1)",

                boxShadow: ativa
                  ? "0 0 25px rgba(74,222,128,0.7)"
                  : "0 5px 12px rgba(0,0,0,0.35)"
              }}
            />

          ))}

        </div>

        <div
          style={{
            marginTop: "25px",
            minHeight: "60px"
          }}
        >

          <h2
            style={{
              animation: "fadeIn 0.5s",

              color:
                mensagem.includes("equivalente")
                  ? "#fde047"
                  : "white"
            }}
          >
            {mensagem}
          </h2>

        </div>

      </div>

      {/* COLUNA DIREITA */}

      <div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "20px"
          }}
        >
          <h3>
            {historias[regiaoAtual].titulo}
          </h3>

          <p>
            {historias[regiaoAtual].texto}
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)",
            marginBottom: "20px"
          }}
        >
          <h3>🎯 Missão Atual</h3>

          <p>
            {missoes[regiaoAtual]}
          </p>
        </div>

        <div
          style={{
            padding: "15px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.08)"
          }}
        >
          <h3>📖 Livro do Explorador</h3>

          {descobertas.length === 0 ? (

            <p>Nenhuma descoberta registrada.</p>

          ) : (

            descobertas.map((item, index) => (
              <p key={index}>
                ✨ {item}
              </p>
            ))

          )}

        </div>

      </div>

    </div>

    <style>
      {`
        @keyframes pulse {
          0% { transform: scale(1.05); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1.05); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}
    </style>

  </div>
);
}
export default Explorador;