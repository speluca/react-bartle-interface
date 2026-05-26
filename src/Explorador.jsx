import { useState, useEffect } from "react";

function Explorador({ voltar }) {

  const [regiaoAtual, setRegiaoAtual] = useState(1);
  const [desbloqueadas, setDesbloqueadas] = useState([1]);

  const [quantidade, setQuantidade] = useState(4);
  const [partes, setPartes] = useState(Array(4).fill(false));

  const [mensagem, setMensagem] = useState("");
  const [animandoMapa, setAnimandoMapa] = useState(false);

  // controla quantidade de peças por região
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

    // limpa mensagem se nada estiver marcado
    if (ativas === 0) {
      setMensagem("");
      return;
    }

    let texto = `Você descobriu ${ativas}/${total}`;

    // equivalências
    if (ativas === 2 && total === 4) {
      texto += " — equivalente a 1/2 ✨";
    }

    if (ativas === 3 && total === 6) {
      texto += " — equivalente a 1/2 ✨";
    }

    if (ativas === 4 && total === 8) {
      texto += " — equivalente a 1/2 ✨";
    }

    if (ativas === 2 && total === 8) {
      texto += " — equivalente a 1/4 🌙";
    }

    if (ativas === 4 && total === 6) {
      texto += " — equivalente a 2/3 🔥";
    }

    setMensagem(texto);

    // completou região
    if (ativas === total) {

      setMensagem("🏛️ Ruína restaurada!");

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

          setMensagem("🏆 Você restaurou todas as Ruínas Matemáticas!");

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

  // tema por região
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: tema.fundo,
        color: "white",
        textAlign: "center",
        padding: "30px",
        transition: "1s"
      }}
    >

      {/* botão voltar */}
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
          color: "#111",
          fontSize: "1rem"
        }}
      >
        ⬅ Voltar
      </button>

      {/* título */}
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px"
        }}
      >
        🧭 Ruínas Matemáticas
      </h1>

      <h2
        style={{
          opacity: 0.9,
          marginBottom: "10px"
        }}
      >
        {tema.titulo}
      </h2>

      <p
        style={{
          opacity: 0.75,
          maxWidth: "700px",
          margin: "0 auto"
        }}
      >
        Explore territórios antigos e descubra
        frações escondidas nas ruínas.
      </p>

      {/* MAPA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "25px",
          marginTop: "40px",
          marginBottom: "50px"
        }}
      >

        {[1, 2, 3].map((regiao, index) => {

          const desbloqueada = desbloqueadas.includes(regiao);
          const ativa = regiaoAtual === regiao;

          return (
            <div
              key={regiao}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "25px"
              }}
            >

              <div
                onClick={() => {

                  if (desbloqueada) {
                    setRegiaoAtual(regiao);
                  }

                }}

                style={{
                  width: "85px",
                  height: "85px",

                  borderRadius: "50%",

                  background: ativa
                    ? "#22c55e"
                    : desbloqueada
                    ? "#3b82f6"
                    : "#475569",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  cursor: desbloqueada
                    ? "pointer"
                    : "not-allowed",

                  fontWeight: "bold",

                  fontSize: "1.1rem",

                  border: "4px solid white",

                  transition: "0.4s",

                  transform: ativa
                    ? "scale(1.1)"
                    : "scale(1)",

                  boxShadow: ativa
                    ? "0 0 25px rgba(34,197,94,0.8)"
                    : "0 0 10px rgba(0,0,0,0.4)",

                  animation: animandoMapa && ativa
                    ? "pulse 1s infinite"
                    : "none"
                }}
              >
                {desbloqueada ? `🗺️ ${regiao}` : "🔒"}
              </div>

              {/* linha entre regiões */}
              {index < 2 && (
                <div
                  style={{
                    width: "60px",
                    height: "6px",

                    borderRadius: "10px",

                    background:
                      desbloqueadas.includes(regiao + 1)
                        ? "#4ade80"
                        : "#64748b",

                    transition: "0.4s"
                  }}
                />
              )}

            </div>
          );
        })}

      </div>

      {/* REGIÃO */}
      <h2
        style={{
          marginBottom: "25px"
        }}
      >
        🌎 Região {regiaoAtual}
      </h2>

      {/* GRID */}
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

      {/* FEEDBACK */}
      <div
        style={{
          marginTop: "35px",
          minHeight: "50px"
        }}
      >

        <h2
          style={{
            transition: "0.3s",
            animation: "fadeIn 0.5s"
          }}
        >
          {mensagem}
        </h2>

      </div>

      {/* CSS */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1.05);
            }

            50% {
              transform: scale(1.15);
            }

            100% {
              transform: scale(1.05);
            }
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