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
      titulo: "🌿 Floresta dos Bits",
      texto: "Descubra como números são representados em binário."
    },

    2: {
      titulo: "❄️ Cavernas dos Bytes",
      texto: "Combine bits para formar valores maiores."
    },

    3: {
      titulo: "🔥 Templo da Conversão",
      texto: "Domine a conversão entre binário e decimal."
    }
  };

  const missoes = {
  1: "Forme o número 3",
  2: "Forme o número 6",
  3: "Forme o número 13"
};
  const objetivos = {
    1: 3,
    2: 6,
    3: 13
  };

  const pesos = {
    1: [2, 1],
    2: [4, 2, 1],
    3: [8, 4, 2, 1]
  };

  const nomesReliquias = {
  1: "💾 Fragmento Binário",
  2: "🖥️ Núcleo de Processamento",
  3: "⚙️ Chave da Conversão"
};
  const reliquiasRaras = [
  "💾 Disquete Antigo",
  "🖥️ Núcleo de Processamento",
  "📟 Terminal Perdido"
];

  // quantidade de peças por região
  useEffect(() => {

        let qtd = 2;

    if (regiaoAtual === 2) qtd = 3;
    if (regiaoAtual === 3) qtd = 4;

    setQuantidade(qtd);
    setPartes(Array(qtd).fill(false));

  }, [regiaoAtual]);

  // lógica principal
  useEffect(() => {

  const binarioAtual = partes
    .map(p => (p ? "1" : "0"))
    .join("");

  const decimalAtual = partes.reduce(
    (soma, ativa, index) =>
      ativa
        ? soma + pesos[regiaoAtual][index]
        : soma,
    0
  );

  setMensagem(
    `💻 ${binarioAtual}₂ = ${decimalAtual}`
  );

  if (decimalAtual === objetivos[regiaoAtual]) {

    setMensagem(
      `✅ Correto! ${binarioAtual}₂ = ${decimalAtual}`
    );

    if (
      !descobertas.includes(
        `${binarioAtual}₂ = ${decimalAtual}`
      )
    ) {
      setDescobertas(prev => [
        ...prev,
        `${binarioAtual}₂ = ${decimalAtual}`
      ]);
    }

    if (!reliquias.includes(nomesReliquias[regiaoAtual])) {

      setReliquias(prev => [
        ...prev,
        nomesReliquias[regiaoAtual]
      ]);

    }

    if (Math.random() < 0.5) {

  const reliquiasDisponiveis =
    reliquiasRaras.filter(
      r => !reliquias.includes(r)
    );

  if (reliquiasDisponiveis.length > 0) {

    const bonus =
      reliquiasDisponiveis[
        Math.floor(
          Math.random() *
          reliquiasDisponiveis.length
        )
      ];

    setReliquias(prev => [
      ...prev,
      bonus
    ]);

    setMensagem(
      `🎁 Você encontrou uma relíquia rara: ${bonus}`
    );

  }

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

    }, 2000);
  }

}, [partes]);
  //aqui
  function toggleParte(index) {

    const novo = [...partes];

    novo[index] = !novo[index];

    setPartes(novo);

  }

  function temaRegiao() {

    if (regiaoAtual === 1) {
      return {
        fundo: "linear-gradient(to bottom, #0f172a, #1e293b)",
        titulo: "🌿 Floresta dos Bits"
      };
    }

    if (regiaoAtual === 2) {
      return {
        fundo: "linear-gradient(to bottom, #1e1b4b, #312e81)",
        titulo: "❄️ Cavernas dos Bytes"
      };
    }

    return {
      fundo: "linear-gradient(to bottom, #3f0d12, #a71d31)",
      titulo: "🔥 Templo da Conversão"
    };
  }

  const tema = temaRegiao();

    const binario = partes
  .map(parte => (parte ? "1" : "0"))
  .join("");

  const decimal = partes.reduce(
    (soma, ativa, index) =>
      ativa
        ? soma + pesos[regiaoAtual][index]
        : soma,
    0
  );

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
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px"
  }}
>
  {pesos[regiaoAtual].map((peso, index) => (
    <div
      key={index}
      style={{
        width: "90px",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.2rem"
      }}
    >
      {peso}
    </div>
  ))}
</div>

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

  {/* INVENTÁRIO */}

  <div
    style={{
      padding: "12px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "15px"
    }}
  >
    <h3>🏺 Inventário</h3>

    {reliquias.length === 0 ? (

      <p style={{ opacity: 0.7 }}>
        Nenhuma relíquia encontrada
      </p>

    ) : (

      reliquias.map((item, index) => (

        <div
          key={index}
          style={{
            padding: "8px",
            marginTop: "5px",
            borderRadius: "8px",
            background: "rgba(255,255,255,0.05)",
            textAlign: "center"
          }}
        >
          {item}
        </div>

      ))

    )}

    <div
      style={{
        marginTop: "10px",
        fontSize: "0.7rem",
        opacity: 0.8
      }}
    >
      Encontradas: {reliquias.length}/6
    </div>

  </div>

  {/* MAPA */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)"
    }}
  >
    <h3>🗺️ Mapa das Ruínas</h3>

    {[1, 2, 3].map((regiao) => {

      const desbloqueada =
        desbloqueadas.includes(regiao);

      const ativa =
        regiaoAtual === regiao;

      const nomeRegiao = {
        1: "🌿 Floresta",
        2: "❄️ Cavernas",
        3: "🔥 Templo"
      };

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

            fontWeight: "bold",

            border: ativa
              ? "2px solid white"
              : "2px solid transparent",

            transform: ativa
              ? "scale(1.03)"
              : "scale(1)",

            transition: "0.3s"
          }}
        >
          {desbloqueada
            ? nomeRegiao[regiao]
            : "🔒 Região Bloqueada"}
        </div>

      );

    })}

    <div
      style={{
        marginTop: "15px",
        fontSize: "0.9rem",
        opacity: 0.8
      }}
    >
      Região atual: {regiaoAtual}/3
    </div>

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
      marginBottom: "10px"
    }}
  >
    🧭 Ruínas Binárias
  </h1>

  <h2
    style={{
      marginBottom: "10px"
    }}
  >
    {tema.titulo}
  </h2>

  <p
    style={{
      opacity: 0.8,
      marginBottom: "20px"
    }}
  >
    {historias[regiaoAtual].texto}
  </p>

  {/* PAINEL DE CONVERSÃO */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px"
    }}
  >

    <h3>💻 Conversão Atual</h3>

    <h1>
      {binario}₂
    </h1>

    <h2>
      = {decimal}
    </h2>

    <p>
      🎯 Objetivo: {objetivos[regiaoAtual]}
    </p>

  </div>

  {/* PESOS DOS BITS */}

  <div
    style={{
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "10px"
    }}
  >

    {pesos[regiaoAtual].map((peso, index) => (

      <div
        key={index}
        style={{
          width: "90px",
          fontWeight: "bold",
          fontSize: "1.0rem"
        }}
      >
        {peso}
      </div>

    ))}

  </div>

  {/* BLOCOS */}

  <div
    style={{
      display: "grid",

      gridTemplateColumns: `repeat(${quantidade}, 1fr)`,

      gap: "15px",

      justifyContent: "center",

      maxWidth: quantidade * 105,

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
            : "0 5px 12px rgba(0,0,0,0.35)",

          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          fontSize: "1.5rem",
          fontWeight: "bold"
        }}
      >
        {ativa ? "1" : "0"}
      </div>

    ))}

  </div>

  {/* FEEDBACK */}

  <div
    style={{
      marginTop: "25px",
      minHeight: "60px"
    }}
  >

    <h2
      style={{
        animation: "fadeIn 0.5s",
        color: mensagem.includes("✅")
          ? "#4ade80"
          : "#fde047"
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