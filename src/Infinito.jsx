import { useState, useEffect } from "react";
import "./App.css";

function Infinito({ voltar }) {

  const [energia, setEnergia] = useState(15);
  const [altura, setAltura] = useState(0);
  const [tempo, setTempo] = useState(30);

  const [pergunta, setPergunta] = useState({});
  const [offset, setOffset] = useState(0);
  const [plataformas, setPlataformas] = useState([]);

  // 🧠 gerar pergunta
  function gerarPergunta() {
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 5) + 1;

    const correta = a + b;
    const errada = correta + (Math.random() > 0.5 ? 1 : -1);

    const opcoes = [correta, errada].sort(() => Math.random() - 0.5);

    setPergunta({
      texto: `Quanto é ${a} + ${b}?`,
      resposta: correta,
      opcoes
    });
  }

  // 🎯 responder
  function responder(opcao) {
  if (energia <= 0 || tempo <= 0) return;

  if (opcao === pergunta.resposta) {
    setEnergia(e => Math.min(15, e + 3));
    setAltura(a => a + 40);
    setTempo(t => Math.min(30, t + 2)); // 🔥 ganha tempo aqui
  } else {
    setEnergia(e => e - 2);
  }

  gerarPergunta();
}

  // ⚡ energia caindo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setEnergia(e => e - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // ⏳ timer
  useEffect(() => {
    if (tempo === 0) return;

    const timer = setTimeout(() => {
      setTempo(t => t - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [tempo]);

  // 🎮 movimento do mundo
  useEffect(() => {
    setOffset(altura);
  }, [altura]);

  // 🧱 gerar plataformas
  useEffect(() => {
    const lista = [];

    for (let i = 0; i < 20; i++) {
      lista.push(i * 80);
    }

    setPlataformas(lista);
  }, []);

  // iniciar pergunta
  useEffect(() => {
    gerarPergunta();
  }, []);

  // 💀 game over
  if (energia <= 0 || tempo === 0) {
    return (
      <div style={{ textAlign: "center", paddingTop: "50px" }}>
        <h1>🏁 Fim de jogo</h1>
        <p>Altura alcançada: {altura}</p>
        <button onClick={voltar}>⬅ Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", paddingTop: "30px" }}>

      <button onClick={voltar}>⬅ Voltar</button>

      <h1>🧗 Subida Infinita</h1>

      <h2>Altura: {altura}</h2>
      <h3>Tempo: {tempo}s</h3>

      <div style={{
        width: "300px",
        height: "20px",
        background: "#ccc",
        margin: "20px auto"
        }}>
        <div style={{
            width: `${(tempo / 30) * 100}%`,
            height: "100%",
            background:
            tempo > 20 ? "lime" :
            tempo > 10 ? "orange" :
            "red",
            transition: "1s linear"
        }} />
    </div>

      {/* 🎮 cenário */}
      <div className="cenario">

        <div
          className="mundo"
          style={{
            transform: `translateY(${offset}px)`
          }}
        >
          {plataformas.map((p, i) => (
            <div
              key={i}
              className="plataforma"
              style={{ top: p }}
            />
          ))}
        </div>

        <div className="personagem">🧗</div>

      </div>

      {/* ❓ pergunta */}
      <h2>{pergunta.texto}</h2>

      {pergunta.opcoes?.map((op, i) => (
        <button key={i} onClick={() => responder(op)}>
          {op}
        </button>
      ))}

    </div>
  );
}

export default Infinito;