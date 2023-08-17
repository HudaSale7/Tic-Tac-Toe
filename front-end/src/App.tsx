import { Route, Routes } from "react-router-dom";
import Board from "./components/Board";
import Intro from "./components/Intro";
import Protected from "./components/ProtectedCom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route element={<Protected />}>
        <Route path="/board" element={<Board />} />
      </Route>
    </Routes>
  );
}

export default App;
