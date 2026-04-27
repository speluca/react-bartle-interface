import { useState, useEffect } from "react";

function Explorador({ voltar }) {

  const [nivel, setNivel] = useState(1);
  const [completou, setCompletou] = useState(false);

  const [partes, setPartes] = useState(Array(4).fill(false));
  const [mensagem, setMensagem] = useState("");

  function toggleParte(index) {
    if (completou) return; // evita clicar durante transição

    const novo = [...partes];
    novo[index] = !novo[index];
    setPartes(novo);
  }

  // controla quantidade de partes por nível
  useEffect(() => {
    let qtd = 4;

    if (nivel === 2) qtd = 6;
    if (nivel === 3) qtd = 8;

    setPartes(Array(qtd).fill(false));
    setCompletou(false);

  }, [nivel]);

  // lógica principal do jogo
 useEffect(() => {
  const total = partes.length;
  const ativas = partes.filter(p => p).length;

  if (ativas === 0) {
    setMensagem(""); // 🔥 limpa corretamente
    return;
  }

  if (ativas > 0 && !completou) {
    setMensagem(`Isso representa ${ativas}/${total}`);
  }

  if (ativas === total && !completou) {
    setCompletou(true);
    setMensagem("Você completou o todo! 🎉");

    setTimeout(() => {
      if (nivel < 3) {
        setNivel(n => n + 1);
      } else {
        setMensagem("Você explorou tudo! 🚀");
      }
    }, 1500);
  }

}, [partes]);

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>

      <button onClick={voltar}>⬅ Voltar</button>

      <h2>Nível: {nivel}</h2>

      <h1>🧭 Explore as frações</h1>
      <p>Clique nos blocos e descubra proporções</p>

      <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${partes.length === 6 ? 3 : partes.length === 8 ? 4 : 2}, 70px)`,
            gap: "10px",
            justifyContent: "center",
            marginTop: "30px"
    }}>
        {partes.map((ativa, index) => (
          <div
            key={index}
            onClick={() => toggleParte(index)}
            style={{
              width: "70px",
              height: "70px",
              margin: "5px",
              backgroundColor: ativa ? "green" : "gray",
              cursor: completou ? "default" : "pointer",
              transition: "0.3s",
              borderRadius: "10px"
            }}
          />
        ))}
      </div>

      <h2 style={{ marginTop: "20px" }}>{mensagem}</h2>
        <h1>{partes.filter(p => p).length}/{partes.length}</h1>
    </div>
  );
}

export default Explorador;