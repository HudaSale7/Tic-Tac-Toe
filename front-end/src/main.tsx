import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { HashRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter basename="/Tic-Tac-Toe">
    <App />
  </HashRouter>
);
