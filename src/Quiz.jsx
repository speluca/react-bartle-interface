import { useState, useEffect } from 'react'
import './App.css'

function Quiz({ voltar }) {

  const [pontos, setPontos] = useState(0);
  const [nivel, setNivel] = useState("facil");
  const [indice, setIndice] = useState(0);
  const [acertosSeguidos, setAcertosSeguidos] = useState(0);
  const [perfil, setPerfil] = useState("explorador");
  const [mensagem, setMensagem] = useState("");

  const [botaoClicado, setBotaoClicado] = useState(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);
  const [previousCorrect, setPreviousCorrect] = useState(null);
  const [opcoesEmbaralhadas, setOpcoesEmbaralhadas] = useState([]);

  const perguntas = {
    facil: [
      { texto: "Quanto é 1 + 1?", opcoes: ["2", "3", "1", "4"], resposta: "2" },
      { texto: "Quanto é 5 - 2?", opcoes: ["3", "2", "4", "1"], resposta: "3" },
      { texto: "Quanto é 10 / 2?", opcoes: ["5", "2", "8", "4"], resposta: "5" }
    ],
    medio: [
      { texto: "Quanto é 2 + 2?", opcoes: ["4", "5", "3", "6"], resposta: "4" },
      { texto: "Quanto é 6 x 2?", opcoes: ["12", "10", "14", "8"], resposta: "12" },
      { texto: "Quanto é 9 - 3?", opcoes: ["6", "5", "7", "4"], resposta: "6" }
    ],
    dificil: [
      { texto: "Quanto é 3 x 3?", opcoes: ["9", "6", "12", "3"], resposta: "9" },
      { texto: "Quanto é 12 / 3?", opcoes: ["4", "3", "6", "2"], resposta: "4" },
      { texto: "Quanto é 15 - 7?", opcoes: ["8", "6", "9", "7"], resposta: "8" }
    ]
  };

  const perguntaAtual = perguntas[nivel][indice];

  function embaralhar(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function gerarMensagem(acertou) {
    if (perfil === "explorador") {
      return acertou ? "Você descobriu algo novo! 🧭" : "Continue explorando!";
    }
    if (perfil === "conquistador") {
      return acertou ? "Vitória! +1 ponto 🏆" : "Tente novamente!";
    }
    if (perfil === "social") {
      return acertou ? "Boa! Você está indo bem 😊" : "Não desiste!";
    }
    return acertou ? "Acertou!" : "Errou!";
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);
    setTimeout(() => setMensagem(""), 1500);
  }

  function sortearPergunta() {
    const lista = perguntas[nivel];
    const newIndice = Math.floor(Math.random() * lista.length);

    setIndice(newIndice);
    setOpcoesEmbaralhadas(embaralhar(lista[newIndice].opcoes));
  }

  function verificarResposta(opcao) {

    setBotaoClicado(opcao);
    setMostrarResposta(true);

    const acertou = opcao === perguntaAtual.resposta;

    if (acertou) {
      setPontos(p => p + 1);
      setAcertosSeguidos(s => s + 1);
      setPreviousCorrect(perguntaAtual.resposta);
      mostrarMensagem(gerarMensagem(true));

      if (acertosSeguidos + 1 >= 2) {
        if (nivel === "facil") setNivel("medio");
        else if (nivel === "medio") setNivel("dificil");
      }

    } else {
      setAcertosSeguidos(0);
      mostrarMensagem(gerarMensagem(false));

      if (nivel === "dificil") setNivel("medio");
      else if (nivel === "medio") setNivel("facil");
    }
  }

  function handleAnimationEnd() {
    if (mostrarResposta) {
      setBotaoClicado(null);
      setMostrarResposta(false);
      setPreviousCorrect(null);
      sortearPergunta();
    }
  }

  useEffect(() => {
    sortearPergunta();
  }, [nivel]);

  return (
    <div>
        <button onClick={voltar}>⬅ Voltar</button>
      {mensagem && (
        <div className="feedback">
          {mensagem}
        </div>
      )}

      <h3>Nível: {nivel}</h3>
      <h2>Pontos: {pontos}</h2>
      <p>🔥 Streak: {acertosSeguidos}</p>

      <div style={{ marginBottom: "20px" }}>
        <div style={{
          height: "10px",
          width: `${(acertosSeguidos / 3) * 100}%`,
          backgroundColor: "lime",
          transition: "0.3s"
        }} />
      </div>

      <h1>{perguntaAtual.texto}</h1>

      {opcoesEmbaralhadas.map((opcao, index) => {
        let classe = "botao";

        if (mostrarResposta) {
          if (opcao === perguntaAtual.resposta) {
            classe = "botao acerto";
          } else if (opcao === botaoClicado) {
            classe = "botao erro";
          }
        }

        if (opcao === previousCorrect) {
          classe += " previous";
        }

        return (
          <button
            key={index}
            onClick={() => verificarResposta(opcao)}
            onAnimationEnd={handleAnimationEnd}
            className={classe}
            disabled={mostrarResposta}
          >
            {opcao}
          </button>
        );
      })}

    </div>
  )
}

export default Quiz