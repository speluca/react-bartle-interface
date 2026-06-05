import { useState } from "react";
import Tela from "./Tela";
import { botaoPrimario, botaoSecundario, botaoDesabilitado } from "./estilos";

function Tcle({ onAceitar, onRecusar }) {
  const [concordo, setConcordo] = useState(false);

  return (
    <Tela largura={680}>
      <h1 style={{ marginTop: 0, fontSize: "1.5rem" }}>
        Termo de Consentimento Livre e Esclarecido
      </h1>

      <div style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.9 }}>
        <p>
          Você está sendo convidado(a) a participar da pesquisa{" "}
          <strong>"[título]"</strong>, conduzida por <strong>[pesquisador]</strong>,
          da <strong>[instituição]</strong>, que investiga como diferentes estilos
          de jogo influenciam o aprendizado do sistema binário.
        </p>
        <p>
          <strong>O que você fará:</strong> responder a um questionário inicial
          (dados demográficos e conhecimento sobre binário), jogar e, ao final,
          responder a um questionário rápido. Tempo estimado: <strong>[~X min]</strong>.
        </p>
        <p>
          <strong>Anonimato:</strong> a participação é <strong>anônima</strong>. Não
          coletamos nome, e-mail, CPF, matrícula ou qualquer dado que identifique
          você. Os resultados serão usados apenas de forma agregada, para fins
          acadêmicos.
        </p>
        <p>
          <strong>Voluntariedade:</strong> sua participação é voluntária; você pode
          desistir a qualquer momento, sem prejuízo.
        </p>
        <p>
          <strong>Riscos/benefícios:</strong> os riscos são mínimos; o benefício é
          contribuir para pesquisas em educação e gamificação.
        </p>
        <p>
          <strong>Contato:</strong> [e-mail do pesquisador].
        </p>
      </div>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          margin: "18px 0",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        <input
          type="checkbox"
          checked={concordo}
          onChange={(e) => setConcordo(e.target.checked)}
          style={{ width: "18px", height: "18px", cursor: "pointer" }}
        />
        Li e concordo em participar
      </label>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <button
          style={concordo ? botaoPrimario : botaoDesabilitado}
          disabled={!concordo}
          onClick={() => concordo && onAceitar()}
        >
          Aceito participar
        </button>
        <button style={botaoSecundario} onClick={onRecusar}>
          Não aceito
        </button>
      </div>
    </Tela>
  );
}

export default Tcle;
