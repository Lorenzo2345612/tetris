import { BasePiece, Piece, Turn } from "./piece_basic";
import { Position } from "../position";

const piece = [
  [1, 1],
  [1, 1]
];

export class Square extends BasePiece implements Piece {
  constructor(color: string, initialPosition: Position) {
    super(color, initialPosition, piece);
  }
  getEstimatedPositionsAfterRotation(turn: Turn): Position[] {
    return this._positions;
  }
  rotate(turn: Turn) {
    return;
  }
}
