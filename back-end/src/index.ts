import express from "express";
import http from "http";
import { Server } from "socket.io";
import { Room } from "./Room";
import { Player } from "./Player";
import 'dotenv/config';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const roomsMap: Map<string, Room> = new Map();

io.on("connection", (socket) => {
    socket.on("create-room", (msg) => {
      const player: Player = new Player(msg.symbol);
      player.round = 1;

      const room = new Room(player);
      const roomId: string = room.getRoomId();
      roomsMap.set(roomId, room);
      room.addPlayer(player, socket.id);
      socket.join(roomId);

      socket.emit("room-id", { roomId: roomId });
    });
  
  socket.on("join-room", (msg) => { 
    
    try {
      const roomId: string = msg.roomId;
      const room: Room | undefined = roomsMap.get(roomId);
      if (!room) {
        throw new Error("Invalid id");
      }
      if (room.playersCount === 2) {
        throw new Error("room is taken");
      }
      let symbol: string;

      if (room.getOwner().getSymbol() === "X") symbol = "O";
      else symbol = "X";

      const player: Player = new Player(symbol);
      room.addPlayer(player, socket.id);
      room.createGame(player);
      socket.join(roomId);
      io.to(roomId).emit("start-game");
    } catch (err: any) {
      socket.emit("error", { error: err.message });
    }
  })

  socket.on("move", (data) => {
    const room: Room | undefined = roomsMap.get(data.roomId);
    if (room?.playersMap.get(socket.id) === room?.game?.getCurrentPlayer()) {
      room?.game?.play(data.row, data.col);
      if (room?.playersMap.get(socket.id)!.getStatus() === 1) {
        io.to(data.roomId).emit("winner", room?.playersMap.get(socket.id)!.getRightMove(), socket.id);
        roomsMap.delete(data.roomId);
      }
      else if (room?.game?.gameOver()) {
        io.to(data.roomId).emit("game-over");
        roomsMap.delete(data.roomId);
      }
    }
    io.to(data.roomId).emit("update", { board: room?.game?.getBoard() });
  });

  socket.on("disconnecting", () => {
    const room: string = Array.from(socket.rooms)[1];
    if (room) { 
      io.to(room).emit("opponent-disconnected");
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log("listening");
});
