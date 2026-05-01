function Hub({ setModo }) {
  return (
    <div className="hub">
      <h1>🎮 Escolha seu estilo</h1>

      <div className="cards">

        <div className="card" onClick={() => setModo("explorador")}>
          <h2>🧭 Explorar</h2>
          <p>Descubra e experimente</p>
        </div>

        <div className="card" onClick={() => setModo("quiz")}>
          <h2>🏆 Desafiar</h2>
          <p>Teste seus conhecimentos</p>
        </div>
        
        <div className="card" onClick={() => setModo("infinito")}>
          <h2>🧗 Subida Infinita</h2>
          <p>Desafie-se em uma jornada sem fim</p>
        </div>

        <div className="card" onClick={() => setModo("construtor")}>
          <h2>🧩 Construtor de Frações</h2>
          <p>Crie e combine frações para formar o alvo</p>
        </div>
      </div>
    </div>
  );
}

export default Hub;