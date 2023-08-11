import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
  },
});

import { Player } from "./Player";
import { Game } from "./Game";

let player1: Player;
let player2: Player;
let game: Game;
let hashMap = new Map<string, Player>();
let symbol: string;

io.on("connection", (socket) => {
  if (io.engine.clientsCount > 2) {
    socket.emit("start-game", "sorry you cannot get in");
    socket.disconnect();
  }
  else if (io.engine.clientsCount === 2) {
    player2 = new Player(symbol, "");
    game = new Game(player1, player2);
    hashMap.set(socket.id, player2);
    io.emit("start-game", { count: io.engine.clientsCount });
  }
  else {
    io.emit("start-game", { count: io.engine.clientsCount });
  }
  socket.on("disconnect", () => {
    socket.broadcast.emit("winner");
    io.disconnectSockets();
  });

  socket.on("choose-symbol", (data) => {
    player1 = new Player(data.mySymbol, "");
    player1.round = 1;
    hashMap.set(socket.id, player1);
    symbol = data.otherSymbol;
  });

  socket.on("move", (data) => {
    if (hashMap.get(socket.id) === game.getCurrentPlayer()) {
      game.play(data.row, data.col);
      if (hashMap.get(socket.id)!.getStatus() === 1) {
        io.emit("winner", hashMap.get(socket.id)!.getRightMove(), socket.id);
      }
      else if (game.gameOver()) {
        io.emit("game-over");
      }
    }
    io.emit("update", { board: game.getBoard() });
  });
});

server.listen(3000, () => {
  console.log("listening");
});
