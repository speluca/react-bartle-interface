import { useState } from "react";
import Hub from "./Hub";
import Quiz from "./Quiz";
import Explorador from "./Explorador";

function App() {

  const [modo, setModo] = useState("hub");

  return (
    <div>

      {modo === "hub" && <Hub setModo={setModo} />}

      {modo === "quiz" && (
        <Quiz voltar={() => setModo("hub")} />
      )}
      {modo === "explorador" && (
        <Explorador voltar={() => setModo("hub")} />
      )}

    </div>
  );
}

export default App;