import { Position } from "../position";
import { BasePiece, Piece, Turn } from "./piece_basic";

const piece = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 0, 0], 
];

export class Line extends BasePiece implements Piece {
  private _currentTurn = 0;
  constructor(color: string, initialPosition: Position) {
    super(color, initialPosition, piece);
  }
}
