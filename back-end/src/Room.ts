import { Game } from "./Game.js";
import { Player } from "./Player.js";
import { v4 as uuidv4 } from 'uuid';

export class Room {
    game: Game | undefined;
    playersCount: number;
    owner: Player;
    invitedPlayer: Player | undefined;
    playersMap: Map<string, Player>;

    constructor(owner: Player) {
        this.owner = owner;
        this.playersCount = 0;
        this.playersMap = new Map();
    }

    addPlayer(player: Player, playerId: string): void {
        this.playersMap.set(playerId, player);
        this.playersCount++;
    }

    createGame(player: Player): void {
        this.invitedPlayer = player;
        this.game = new Game(this.owner, player);
    }

    getRoomId(): string {
        return uuidv4();
    }

    getOwner(): Player {
        return this.owner;
    }
}