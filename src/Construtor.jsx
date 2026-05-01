import { useState } from "react";
import "./App.css";

function Construtor({ voltar }) {

  const alvo = { num: 3, den: 4 };

  const pecas = [
    { id: 1, label: "1/4", num: 1, den: 4 },
    { id: 2, label: "1/2", num: 1, den: 2 },
    { id: 3, label: "1/8", num: 1, den: 8 }
  ];

  const [dropadas, setDropadas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  // 🔢 MDC (para simplificar fração)
  function mdc(a, b) {
    return b === 0 ? a : mdc(b, a % b);
  }

  // ➕ somar frações
  function somarFracoes(lista) {
    if (lista.length === 0) return { num: 0, den: 1 };

    let denominador = lista.reduce((acc, p) => acc * p.den, 1);

    let numerador = lista.reduce((acc, p) => {
      return acc + (denominador / p.den) * p.num;
    }, 0);

    const divisor = mdc(numerador, denominador);

    return {
      num: numerador / divisor,
      den: denominador / divisor
    };
  }

  // 🎯 arrastar
  function handleDragStart(e, peca) {
    e.dataTransfer.setData("peca", JSON.stringify(peca));
  }

  // permitir drop
  function handleDragOver(e) {
    e.preventDefault();
  }

  // 📦 soltar
  function handleDrop(e) {
    const data = JSON.parse(e.dataTransfer.getData("peca"));

    const novaLista = [...dropadas, data];
    setDropadas(novaLista);

    const total = somarFracoes(novaLista);

    if (total.num === alvo.num && total.den === alvo.den) {
      setMensagem("Perfeito! 🎉");
    } else if ((total.num / total.den) > (alvo.num / alvo.den)) {
      setMensagem("Passou! 😬");
    } else {
      setMensagem("");
    }
  }

  function resetar() {
    setDropadas([]);
    setMensagem("");
  }

  const total = somarFracoes(dropadas);

  return (
    <div className="container">

      <button onClick={voltar}>⬅ Voltar</button>

      <h1>🧩 Construtor de Frações</h1>

      <h2>Monte: {alvo.num}/{alvo.den}</h2>

      {/* 🧲 área de encaixe */}
      <div
        className="drop-area"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {dropadas.map((p, i) => (
          <div key={i} className="slot">
            <div className="peca usada">{p.label}</div>
          </div>
        ))}
      </div>

      <h3>Total: {total.num}/{total.den}</h3>

      <p>{mensagem}</p>

      {/* 🎴 peças */}
      <div className="pecas">
        {pecas.map((p) => (
          <div
            key={p.id}
            className="peca"
            draggable
            onDragStart={(e) => handleDragStart(e, p)}
          >
            {p.label}
          </div>
        ))}
      </div>

      <button onClick={resetar}>Limpar</button>

    </div>
  );
}

export default Construtor;