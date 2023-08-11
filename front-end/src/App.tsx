import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Board from "./components/Board"
import Intro from "./components/Intro";
import Protected from "./components/ProtectedCom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route element={ <Protected/> }>
          <Route path="/board" element={<Board />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
