import "../styles/Board.css";
import socket from "../socket";
import { useEffect, useState } from "react";

const Board = () => {
  const [board, setBoard] = useState(Array(3).fill("?").map(() => Array(3).fill("?")));
  const [status, setStatus] = useState("");
  const [display, setDisplay] = useState("hidden");

  const handleMove = (i: number, j: number) => {
    socket.emit("move", { row: i, col: j });
  };

  const handleWinner = (winner: { dir: string, row: number, col: number }, id: string) => { 
    switch (winner.dir) {
      case "horizontal":
        for (let i = 0; i < 3; i++) { 
          document.getElementById(`${winner.row},${i}`)?.classList.add(winner.dir);
        }
        break;
      case "vertical":
        for (let i = 0; i < 3; i++) { 
          document.getElementById(`${i},${winner.col}`)?.classList.add(winner.dir);
        }
        break;
      case "diagonal":
        if (winner.row === 0) {
          for (let i = 0; i < 3; i++) { 
            document.getElementById(`${i},${i}`)?.classList.add(winner.dir);
          }
        }
        else {
          for (let i = 2; i >= 0; i--) { 
            document.getElementById(`${i},${i}`)?.classList.add(winner.dir);
          }
        }
        break;
      default:
        break;
    }
    if (socket.id === id) {
      handleGameOver("congratulations");
    }
    else {
      handleGameOver("oops! sorry");
  }
  }

  useEffect(() => {
    socket.on("update", (data) => {
      setBoard(data.board);
    });

    socket.on("winner", (data, id) => {
      if (!data) {
        handleGameOver("congratulations");
      }
      handleWinner(data, id);
    });

    socket.on("game-over", () => {
      handleGameOver("game over try again!");
    });
  });

  const handleGameOver = (s: string) => {
    setTimeout(() => {
      setDisplay("layer");
      setStatus(s.toUpperCase());
      localStorage.removeItem("userCount");
    }, 1000);
  }

  return (
    <div className="board">
      <div className={display}>
      {status}
      </div>
      {
        Array(3)
        .fill(null)
        .map((_, i: number) => {
          return Array(3).fill(null).map((_, j: number) => {
            return (
              <>
              <div className="square" key={`${i},${j}`} id={`${i},${j}`}
                onClick={() => handleMove(i, j)}>
                {board[i][j]}
              </div>
              </>
            );
          })
        })}
    </div>
  );
};

export default Board;
