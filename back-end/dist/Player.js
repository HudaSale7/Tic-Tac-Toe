export class Player {
    constructor(symbol) {
        this.symbol = symbol;
        this.status = 0;
        this.round = 0;
        this.rightMove = {
            dir: "",
            row: 0,
            col: 0
        };
    }
    getSymbol() {
        return this.symbol;
    }
    setStatus(status) {
        this.status = status;
    }
    getStatus() {
        return this.status;
    }
    setRightMove(dir, row, col) {
        this.rightMove = {
            dir: dir,
            row: row,
            col: col
        };
    }
    getRightMove() {
        return this.rightMove;
    }
}
