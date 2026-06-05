import Tela from "./Tela";
import { botaoPrimario } from "./estilos";

function Transicao({ onContinuar }) {
  return (
    <Tela largura={520}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>🎮</div>
        <h1 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>Tudo certo!</h1>
        <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
          Suas respostas foram registradas. Agora começa a parte divertida: você
          vai <strong>jogar</strong>, e todos os jogos envolvem{" "}
          <strong>números binários</strong>. Jogue no seu ritmo — ao terminar, há
          um questionário rápido final.
        </p>
        <p style={{ fontWeight: 700, marginBottom: "24px" }}>Boa sorte! 🍀</p>

        <button style={botaoPrimario} onClick={onContinuar}>
          Começar os jogos
        </button>
      </div>
    </Tela>
  );
}

export default Transicao;
