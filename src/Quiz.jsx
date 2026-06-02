import React, { useState, useEffect } from "react";

function Conquistador({ voltar }) {
    const [andar, setAndar] = useState(0);
    const [pontos, setPontos] = useState(0);
    const [energia, setEnergia] = useState(10);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [reliquias, setReliquias] = useState([]);
    const [sequenciaAtual, setSequenciaAtual] = useState(0);
    const [maiorSequencia, setMaiorSequencia] = useState(0);
    const [jogoFinalizado, setJogoFinalizado] = useState(false);
    const [bits, setBits] = useState([false, false, false, false]);
    const [numeroAlvo, setNumeroAlvo] = useState(2);
    const [valorAtual, setValorAtual] = useState(0);
    const [mensagem, setMensagem] = useState("");
    const [cliquesBits, setCliquesBits] = useState(0);
    const [modulosResolvidos, setModulosResolvidos] = useState(0);
    const [historicoModulos, setHistoricoModulos] = useState([]);
    const [inicioModulo, setInicioModulo] = useState(Date.now());
    const [acertos, setAcertos] = useState(0);
    const [erros, setErros] = useState(0);


    function toggleBit(index) {

      if (jogoFinalizado) return;

      const novo = [...bits];

      novo[index] = !novo[index];

      setBits(novo);

      setCliquesBits(prev => prev + 1);

}

    function obterPesos() {

      if (andar < 5) {
        return [2, 1];
      }

      if (andar < 10) {
        return [4, 2, 1];
      }

      return [8, 4, 2, 1];

    }

    function gerarNumero() {

      if (andar < 5) {
        const numeros = [2, 3];
        return numeros[
          Math.floor(Math.random() * numeros.length)
        ];
      }
      if (andar < 10) {
        return Math.floor(Math.random() * 6) + 2;
      }
      return Math.floor(Math.random() * 14) + 2;
}

useEffect(() => {

  const pesos = obterPesos();

  let soma = 0;

  bits.forEach((ativo, index) => {

    if (ativo) {
      soma += pesos[index];
    }

  });

  setValorAtual(soma);

}, [bits, andar]);

useEffect(() => {

  if (valorAtual !== numeroAlvo) return;

  const tempoModulo =
    (Date.now() - inicioModulo) / 1000;

  setMensagem("✔ Módulo Energizado!");

  setPontos(prev => prev + 1);
  setAcertos(prev => prev + 1);

  setAndar(prev => prev + 1);

  setEnergia(prev =>
    Math.min(prev + 1, 10)
  );

  setModulosResolvidos(prev => prev + 1);

  setSequenciaAtual(prev => {

    const nova = prev + 1;

    setMaiorSequencia(atual =>
      Math.max(atual, nova)
    );

    return nova;

  });

  setHistoricoModulos(prev => [

    ...prev,

    {
      alvo: numeroAlvo,
      tempo: tempoModulo
    }

  ]);

  setTimeout(() => {

    const novosPesos =
      andar + 1 < 5
        ? [2, 1]
        : andar + 1 < 10
        ? [4, 2, 1]
        : [8, 4, 2, 1];

    setBits(
      Array(novosPesos.length).fill(false)
    );

    setNumeroAlvo(gerarNumero());

    setInicioModulo(Date.now());

    setMensagem("");

  }, 700);

}, [valorAtual]);

useEffect(() => {

  setNumeroAlvo(gerarNumero());

  setBits([false, false]);

}, []);

useEffect(() => {

  if (jogoFinalizado) return;

  const intervalo = setInterval(() => {

    setTempoRestante(prev => {

      if (prev <= 1) {

        setJogoFinalizado(true);

        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(intervalo);

}, [jogoFinalizado]);

useEffect(() => {

  if (jogoFinalizado) return;

  const intervalo = setInterval(() => {

    setEnergia(prev => {

      if (prev <= 1) {

        setJogoFinalizado(true);

        return 0;
      }

      return prev - 1;

    });

  }, 2000);

  return () => clearInterval(intervalo);

}, [jogoFinalizado]);

useEffect(() => {

  if (valorAtual > numeroAlvo) {

    setErros(prev => prev + 1);

    setSequenciaAtual(0);

    setMensagem("✖ Valor acima do alvo");

  }

}, [valorAtual]);
const totalTentativas =
  acertos + erros;

const precisao =
  totalTentativas === 0
    ? 0
    : Math.round(
        (acertos / totalTentativas) * 100
      );

  const tempoMedio =
  historicoModulos.length === 0
    ? 0
    : (
        historicoModulos.reduce(
          (acc, item) => acc + item.tempo,
          0
        ) / historicoModulos.length
      ).toFixed(1);



      if (jogoFinalizado) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        textAlign: "center"
      }}
    >

      <h1>🏆 Resultado</h1>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "left",
          background: "rgba(255,255,255,0.08)",
          padding: "25px",
          borderRadius: "15px"
        }}
      >

        <h3>🏢 Andar Máximo: {andar}</h3>

        <h3>🏆 Pontuação: {pontos}</h3>

        <h3>🎯 Precisão: {precisao}%</h3>

        <h3>🔥 Maior Sequência: {maiorSequencia}</h3>

        <h3>🖱 Cliques nos Bits: {cliquesBits}</h3>

        <h3>
          ⏱ Tempo Médio por Módulo:
          {" "}
          {tempoMedio}s
        </h3>

        <h3>
          🧩 Módulos Resolvidos:
          {" "}
          {modulosResolvidos}
        </h3>

        <h2
          style={{
            marginTop: "30px"
          }}
        >
          🏺 Relíquias Obtidas
        </h2>

        {
          reliquias.length === 0
          ? (
            <p>Nenhuma encontrada.</p>
          )
          : (
            reliquias.map((item, index) => (
              <p key={index}>
                {item}
              </p>
            ))
          )
        }

      </div>

      <button
        onClick={voltar}
        style={{
          marginTop: "25px",
          padding: "12px 20px",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer"
        }}
      >
        ⬅ Voltar ao Hub
      </button>

    </div>

  );

}
  return (

    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #0f172a, #1e293b)",
        color: "white",
        padding: "20px"
      }}
    >

      <button
        onClick={voltar}
        style={{
          padding: "10px 20px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        ⬅ Voltar
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "250px 1fr 250px",
          gap: "20px",
          height: "85vh"
        }}
      >

        {/* ESQUERDA */}

<div>

  {/* ENERGIA */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px"
    }}
  >

    <h3>⚡ Energia</h3>

    <h2>{energia}/10</h2>

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
          width: `${energia * 10}%`,
          height: "100%",
          background: "#22c55e",
          transition: "0.3s"
        }}
      />

    </div>

  </div>

  {/* TORRE */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px"
    }}
  >

    <div
  style={{
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "center",
    gap: "3px",
    marginTop: "15px",
    minHeight: "220px"
  }}
>

  {[...Array(Math.min(andar, 15))].map((_, index) => (

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
      height: "20px",
      background: "#64748b",
      borderRadius: "6px",
      border: "2px solid white"
    }}
  />

</div>

<h2 style={{ marginTop: "15px" }}>
  {andar}
</h2>

<p>andares concluídos</p>

  </div>

  {/* RELÍQUIAS */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)"
    }}
  >

    <h3>🏺 Relíquias</h3>

    <div
      style={{
        fontSize: "1.2rem",
        lineHeight: "2"
      }}
    >

      {reliquias.length === 0 ? (

        <p>Nenhuma encontrada</p>

      ) : (

        reliquias.map((item, index) => (
          <div key={index}>
            {item}
          </div>
        ))

      )}

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
    📡 Torre da Transmissão
  </h1>

  <p
    style={{
      opacity: 0.8,
      marginBottom: "25px"
    }}
  >
    Energize o módulo convertendo o valor decimal para binário.
  </p>

  {/* ALVO */}

  <div
    style={{
      padding: "20px",
      borderRadius: "15px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "25px"
    }}
  >

    <h3>🎯 Valor Alvo</h3>

    <h1
      style={{
        fontSize: "4rem",
        margin: 0
      }}
    >
      {numeroAlvo}
    </h1>

  </div>

  {/* VALOR FORMADO */}

  <div
    style={{
      padding: "15px",
      borderRadius: "15px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "25px"
    }}
  >

    <h3>🔢 Valor Formado</h3>

    <h1>{valorAtual}</h1>

  </div>

  {/* PESOS */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 80px)",
      justifyContent: "center",
      gap: "15px",
      marginBottom: "10px"
    }}
  >

    {obterPesos().map((peso) => (

      <div
        key={peso}
        style={{
          fontWeight: "bold",
          fontSize: "1.2rem"
        }}
      >
        {peso}
      </div>

    ))}

  </div>

  {/* BITS */}

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 80px)",
      justifyContent: "center",
      gap: "15px"
    }}
  >

    {bits.map((ativo, index) => (

      <button
        key={index}
        onClick={() => toggleBit(index)}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "15px",
          border: "none",
          cursor: "pointer",

          fontSize: "1.8rem",
          fontWeight: "bold",

          background: ativo
            ? "#22c55e"
            : "#475569",

          color: "white",

          transform: ativo
            ? "scale(1.08)"
            : "scale(1)",

          transition: "0.3s"
        }}
      >
        {ativo ? "1" : "0"}
      </button>

    ))}

  </div>

  {/* FEEDBACK */}

  <div
    style={{
      marginTop: "30px",
      minHeight: "50px"
    }}
  >

    <h2
      style={{
        color:
          mensagem.includes("✔")
            ? "#4ade80"
            : mensagem.includes("✖")
            ? "#f87171"
            : "white"
      }}
    >
      {mensagem}
    </h2>

  </div>

</div>

        {/* COLUNA DIREITA */}

<div>

  {/* TEMPO */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px",
      textAlign: "center"
    }}
  >

    <h3>⏱ Tempo</h3>

    <h1
      style={{
        margin: 0,
        color:
          tempoRestante <= 10
            ? "#f87171"
            : "white"
      }}
    >
      {tempoRestante}s
    </h1>

  </div>

  {/* PONTOS */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px",
      textAlign: "center"
    }}
  >

    <h3>🏆 Pontos</h3>

    <h1>{pontos}</h1>

  </div>

  {/* SEQUÊNCIA */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      marginBottom: "20px",
      textAlign: "center"
    }}
  >

    <h3>🔥 Sequência</h3>

    <h1>{sequenciaAtual}</h1>

  </div>

  {/* RECORDE */}

  <div
    style={{
      padding: "15px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.08)",
      textAlign: "center"
    }}
  >

    <h3>📈 Melhor Sequência</h3>

    <h1>{maiorSequencia}</h1>

  </div>

</div>

      </div>

    </div>

  );
}

export default Conquistador;