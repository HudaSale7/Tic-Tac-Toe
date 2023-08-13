export class Player {
    private symbol: string;
    private status: number;
    public round: number;
    private rightMove: object;

    constructor(symbol: string) {
        this.symbol = symbol;
        this.status = 0;
        this.round = 0;
        this.rightMove = {
            dir: "",
            row: 0,
            col: 0
        };
    }
    getSymbol(): string {
        return this.symbol;
    }
    setStatus(status: number) {
        this.status = status;
    }
    getStatus(): number {
        return this.status;
    }
    setRightMove(dir: string, row: number, col: number) {
        this.rightMove = {
            dir: dir,
            row: row,
            col: col
        };
    }
    getRightMove(): object {
        return this.rightMove;
    }
}

