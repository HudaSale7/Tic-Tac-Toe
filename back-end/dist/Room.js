import { Game } from "./Game";
import { v4 as uuidv4 } from 'uuid';
export class Room {
    constructor(owner) {
        this.owner = owner;
        this.playersCount = 0;
        this.playersMap = new Map();
    }
    addPlayer(player, playerId) {
        this.playersMap.set(playerId, player);
        this.playersCount++;
    }
    createGame(player) {
        this.invitedPlayer = player;
        this.game = new Game(this.owner, player);
    }
    getRoomId() {
        return uuidv4();
    }
    getOwner() {
        return this.owner;
    }
}
