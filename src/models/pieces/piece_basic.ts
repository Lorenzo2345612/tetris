import { TetrisMath } from "../../utils/math";
import { DireccionRotacion, rotarMatriz } from "../../utils/matrix";
import { Position } from "../position";
import { Square } from "./square_piece";

export enum Turn {
  Right,
  Left,
}

export enum Move {
  left,
  right,
  down,
}


export enum PieceType {
  square,
  line,
  t,
  l,
  j,
  s,
  z,
}

export interface Piece {
  color: string;
  rotate(turn: Turn): void;
  move(move: Move): void;
  getEstimatedPositionAfterMove(move: Move): Position[];
  getCurrentPositions(): Position[];
  getEstimatedPositionsAfterRotation(turn: Turn): Position[];
  isPositionInCurrentPositions(position: Position): boolean;
  isHableToMove(): boolean;
}

export class BasePiece {
  protected _positions: Position[];
  protected _pieceMatrix: number[][];
  public readonly color: string;
  private currentReferencePosition: Position;

  constructor(color: string, initialReferencePosition: Position, pieceMatrix: number[][]) {
    this.color = color;
    this.currentReferencePosition = initialReferencePosition;
    this._pieceMatrix =pieceMatrix;
    this._positions = this.calculateCurrentPositions(this._pieceMatrix);
  }

  protected calculateCurrentPositions(positionMatrix: number[][]): Position[] {
    let positions: Position[] = [];
    positionMatrix.forEach((value, rowIndex)=>{
      value.forEach((isActive, columnIndex) => {
        if (isActive) {
          positions.push(new Position(this.currentReferencePosition.row + rowIndex, this.currentReferencePosition.column + columnIndex));
        }
      });
    })
    return positions;
  }

  isPositionInCurrentPositions(position: Position): boolean {
    return this._positions.some(
      (value) => value.row === position.row && value.column === position.column
    );
  }

  public getCurrentPositions() {
    return [...this._positions];
  }

  public getEstimatedPositionsAfterRotation(turn: Turn): Position[] {
    const expectedPositionsMatrix = rotarMatriz(this._pieceMatrix, turn === Turn.Right ? DireccionRotacion.Horario : DireccionRotacion.Antihorario);
    return this.calculateCurrentPositions(expectedPositionsMatrix);
  }

  rotate(turn: Turn) {
    const expectedPositions = rotarMatriz(this._pieceMatrix, turn === Turn.Right ? DireccionRotacion.Horario : DireccionRotacion.Antihorario);
    this._pieceMatrix = expectedPositions;
    this._positions = this.calculateCurrentPositions(expectedPositions);
  }

  move(move: Move): void {
    switch (move) {
      case Move.left:
        this.currentReferencePosition.column--;
        this._positions.forEach((position) => position.column--);
        break;
      case Move.right:
        this.currentReferencePosition.column++;
        this._positions.forEach((position) => position.column++);
        break;
      case Move.down:
        this.currentReferencePosition.row++;
        this._positions.forEach((position) => position.row++);
        break;
      default:
        break;
    }
  }
  
  getEstimatedPositionAfterMove(move: Move): Position[] {
    switch (move) {
      case Move.left:
        return this._positions.map(
          (position) => new Position(position.row, position.column - 1)
        );
      case Move.right:
        return this._positions.map(
          (position) => new Position(position.row, position.column + 1)
        );
      case Move.down:
        return this._positions.map(
          (position) => new Position(position.row + 1, position.column)
        );
      default:
        return this._positions.map(
          (position) => new Position(position.row, position.column)
        );
    }
  }

  public isHableToMove(): boolean {
    return this._positions.every((position) => position.row > 4);
  }
}










