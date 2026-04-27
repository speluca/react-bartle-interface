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

        <div className="card">
          <h2>⚔️ Competir</h2>
          <p>Em breve...</p>
        </div>

      </div>
    </div>
  );
}

export default Hub;