import { Player } from "./Player";

export class Game {
    private player!: Player;
    private nextPlayer!: Player;
    private board: string[][];

    constructor(player1: Player, player2: Player) {
        this.switching(player1, player2);
        this.board = Array(3).fill("?").map(() => Array(3).fill("?"));
    }

    play(row: number, col: number): void {
        this.board[row][col] = this.player.getSymbol();
        let status: number = this.checkWinner(this.player.getSymbol());
        this.player.setStatus(status);
        this.player.round = 0;
        this.nextPlayer.round = 1;
        this.switching(this.player, this.nextPlayer);
    }

    getBoard(): string[][] {
        return this.board;
    }

    getCurrentPlayer(): Player {
        return this.player;
    }

    checkWinner(symbol: string): number {
        return this.checkDiagonal(symbol)
            || this.checkHorizontal(symbol)
            || this.checkVertical(symbol);
    }

    checkHorizontal(symbol: string): number {
        let h: number = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === symbol) h++;
            }
            if (h === 3) {
                this.player.setRightMove("horizontal", i, 0);
                return 1;
            }
            h = 0;
        }
        return 0;
    }

    checkVertical(symbol: string): number {
        let v: number = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[j][i] === symbol) v++;
            }
            if (v === 3) {
                this.player.setRightMove("vertical", 0, i);
                return 1;
            }
            v = 0;
        }
        return 0;
    }

    checkDiagonal(symbol: string): number {
        let count: number = 0;
        for (let i = 0; i < 3; i++) {
            if (this.board[i][i] === symbol) count++;
        }
        if (count === 3) {
            this.player.setRightMove("diagonal", 0, 0);
            return 1;
        }
        count = 0;
        for (let i = 2; i >= 0; i--) {
            if (this.board[i][i] === symbol) count++;
        }
        if (count === 3) {
            this.player.setRightMove("diagonal", 2, 2);
            return 1;
        }
        return 0;
    }

    gameOver(): number {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === "?") return 0;
            }
        }
        return 1;
    }

    switching(player1: Player, player2: Player) {
        let temp: Player;
        if (player1.round === 1) {
            this.player = player1;
            this.nextPlayer = player2;
        } else {
            temp = player1;
            this.player = player2;
            this.nextPlayer = temp;
        }
    }

}