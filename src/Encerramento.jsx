import Tela from "./Tela";
import { botaoSecundario } from "./estilos";

function Encerramento({ recusado, onSair }) {
  return (
    <Tela largura={520}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>{recusado ? "👋" : "🏁"}</div>

        {recusado ? (
          <>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>
              Tudo bem!
            </h1>
            <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
              Você optou por não participar. Obrigado pelo seu tempo. Nenhum dado
              foi coletado.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "12px" }}>
              Estudo concluído!
            </h1>
            <p style={{ opacity: 0.85, lineHeight: 1.6 }}>
              Muito obrigado pela sua participação. Suas respostas foram salvas de
              forma <strong>anônima</strong> e ajudarão a pesquisa. Você já pode
              fechar a janela.
            </p>
          </>
        )}

        {onSair && (
          <button style={{ ...botaoSecundario, marginTop: "20px" }} onClick={onSair}>
            Voltar ao início
          </button>
        )}
      </div>
    </Tela>
  );
}

export default Encerramento;
