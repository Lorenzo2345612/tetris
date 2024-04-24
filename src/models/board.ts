import { Piece } from "./pieces/piece_basic";
import { Position } from "./position";


export class BoardModel {
    protected _board: BoardPosition[][] = [];
    private _height: number = 24;
    private _width: number = 15;
    constructor(){
        this._board = this.createBoard();
    };

    private createBoard(): BoardPosition[][] {
        const board: BoardPosition[][] = [];
        for(let i = 0; i < this._height; i++){
            board.push([]);
            for(let j = 0; j < this._width; j++){
                board[i].push(new BoardPosition());
            }
        }
        return board;
    }

    public get width(): number {
        return this._width;
    }

    public get board(): BoardPosition[][] {
        return this._board;
    }

    public checkIfPositionIsTaken(position: Position): boolean {
        return this.board[position.row][position.column].isAlreadyTaken;
    }

    public isOutOfBounds(position: Position): boolean {
        if (position.row >= this._height || position.row < 0 || position.column >= this._width || position.column < 0) return true;
        return false;
    }

    public checkIfManyPositionsAreTaken(positionsToCheck: Position[], piece: Piece): boolean {
        for(let i = 0; i < positionsToCheck.length; i++){
            const position = positionsToCheck[i];
            if(this.isOutOfBounds(position)) {
                return true;
            }
            if(this.checkIfPositionIsTaken(position) && !piece.isPositionInCurrentPositions(position)){
                return true;
            }
        }
        return false;
    }   

    public arePositionsTaken(positionsToCheck: Position[]): boolean {
        for(let i = 0; i < positionsToCheck.length; i++){
            const position = positionsToCheck[i];
            if(this.isOutOfBounds(position)) {
                return true;
            }
            if(this.checkIfPositionIsTaken(position)){
                return true;
            }
        }
        return false;
    }

    public clearPositions(positions: Position[]) {
        positions.forEach((value) => {
            const position = this._board[value.row][value.column];
            position.color = undefined;
            position.isAlreadyTaken = false;
        });
    }

    public getBoardPosition(position: Position) {
        return this._board[position.row][position.column];
    }

    public takePositions(positions: Position[], color: string) {
        positions.forEach((value) => {
            const position = this._board[value.row][value.column];
            position.color = color;
            position.isAlreadyTaken = true;
        });
    }

    public copy() {
        const newBoard = new BoardModel();
        newBoard._board = this._board;
        return newBoard;
    }

    public static copyBoard(board: BoardModel) {
        const newBoard = new BoardModel();
        newBoard._board = board._board;
        return newBoard;
    }

    private getFullRows() {
        const lines: number[] = [];
        for(let i = 0; i < this._height; i++){
            let isLineTaken = true;
            for(let j = 0; j < this._width; j++){
                if(!this._board[i][j].isAlreadyTaken){
                    isLineTaken = false;
                    break;
                }
            }
            if(isLineTaken){
                lines.push(i);
            }
        }
        return lines;
    }

    private replaceFullRows(lines: number[]){
        //TODO: Error when deleting the last line.
        lines.sort();
        for(let i = lines.length - 1; i >= 0; i--){
            console.log("Deleting line: " + lines[i]);
            console.log(lines[i]);
            console.log('line deleted:')
            console.log(this.board.splice(lines[i], 1));
        }
        for(let i = 0; i < lines.length; i++){
            this.board.unshift([]);
            for(let j = 0; j < this._width; j++){
                this.board[0].push(new BoardPosition());
            }
        }
    }

    public deleteFullRows() {
        const lines = this.getFullRows();
        console.log(lines);
        if(lines.length > 0){
            this.replaceFullRows(lines);
            return lines.length;
        }
        return 0;
    }


}

class BoardPosition {
    public isAlreadyTaken: boolean = false;
    public color?: string;
    constructor(){};
}