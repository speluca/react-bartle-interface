import { useState, useEffect } from "react";

function Explorador({ voltar }) {

  const [regiaoAtual, setRegiaoAtual] = useState(1);
  const [desbloqueadas, setDesbloqueadas] = useState([1]);

  const [quantidade, setQuantidade] = useState(4);
  const [partes, setPartes] = useState(Array(4).fill(false));
  const [mensagem, setMensagem] = useState("");

  // controla quantidade por região
  useEffect(() => {

    let qtd = 4;

    if (regiaoAtual === 2) qtd = 6;
    if (regiaoAtual === 3) qtd = 8;

    setQuantidade(qtd);
    setPartes(Array(qtd).fill(false));

  }, [regiaoAtual]);

  // lógica das frações
  useEffect(() => {

    const total = partes.length;
    const ativas = partes.filter(p => p).length;

    // remove mensagem ao limpar tudo
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

    setMensagem(texto);

    // completou região
    if (ativas === total) {

      setMensagem("Ruína restaurada! 🎉");

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

          setMensagem("Você restaurou todas as ruínas! 🏆");

        }

      }, 2000);
    }

  }, [partes]);

  function toggleParte(index) {

    const novo = [...partes];
    novo[index] = !novo[index];
    setPartes(novo);

  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
        color: "white",
        textAlign: "center",
        padding: "30px"
      }}
    >

      {/* botão voltar */}
      <button
        onClick={voltar}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px",
          fontWeight: "bold"
        }}
      >
        ⬅ Voltar
      </button>

      {/* título */}
      <h1 style={{ fontSize: "3rem" }}>
        🧭 Ruínas Matemáticas
      </h1>

      <p style={{ opacity: 0.8 }}>
        Explore fragmentos antigos e descubra
        proporções escondidas.
      </p>

      {/* MAPA */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginTop: "30px",
          marginBottom: "40px"
        }}
      >

        {[1, 2, 3].map((regiao) => {

          const desbloqueada = desbloqueadas.includes(regiao);
          const ativa = regiaoAtual === regiao;

          return (
            <div
              key={regiao}

              onClick={() => {
                if (desbloqueada) {
                  setRegiaoAtual(regiao);
                }
              }}

              style={{
                width: "80px",
                height: "80px",

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

                border: "3px solid white",

                transition: "0.3s",

                boxShadow: ativa
                  ? "0 0 20px rgba(34,197,94,0.8)"
                  : "none"
              }}
            >
              {desbloqueada ? `🗺️ ${regiao}` : "🔒"}
            </div>
          );
        })}

      </div>

      {/* região atual */}
      <h2>🌎 Região {regiaoAtual}</h2>

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

          gap: "12px",

          justifyContent: "center",

          maxWidth:
            quantidade === 4
              ? "420px"
              : quantidade === 6
              ? "320px"
              : "420px",

          margin: "40px auto"
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

              borderRadius: "14px",

              cursor: "pointer",

              transition: "0.3s",

              transform: ativa
                ? "scale(1.05)"
                : "scale(1)",

              boxShadow: ativa
                ? "0 0 20px rgba(74, 222, 128, 0.7)"
                : "0 4px 10px rgba(0,0,0,0.3)"
            }}
          />

        ))}

      </div>

      {/* mensagem */}
      <h2
        style={{
          minHeight: "40px",
          transition: "0.3s"
        }}
      >
        {mensagem}
      </h2>

    </div>
  );
}

export default Explorador;