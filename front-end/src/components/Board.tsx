import "../styles/Board.css";
import socket from "../socket";
import { useEffect, useState } from "react";

const Board = () => {
  const [display, setDisplay] = useState("layer");
  const [board, setBoard] = useState(Array(3).fill("?").map(() => Array(3).fill("?")));

  const handleMove = (i: number, j: number) => {
    socket.emit("move", { row: i, col: j });
  };

  const handleSymbol = (s: string = "X") => { 
    let symbol: string ;
    if (s === "X") symbol = "O";
    else symbol = "X";
    socket.emit("choose-symbol", { mySymbol: s, otherSymbol: symbol });
  }

  const handleWinner = (winner: { dir: string, row: number, col: number }) => { 
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
  }

  useEffect(() => {
    socket.on("start-game", (data) => {
      if (data.count === 2) {
        setDisplay("hidden");
      }
    });

    socket.on("update", (data) => {
      setBoard(data.board);
    });

    socket.on("winner", (data) => {
      handleWinner(data);
    });

    socket.on("game-over", () => {
      
    });
  }, []);

  return (
    <div className="board">
      <div className={display}>
        <input type="button" value="X"
        onClick={() => handleSymbol("X")}/>
        <input type="button" value="O"
        onClick={() => handleSymbol("O")}/>
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
