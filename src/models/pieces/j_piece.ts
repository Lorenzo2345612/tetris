import { Position } from "../position";
import { BasePiece, Piece, Turn } from "./piece_basic";

const piece = [
  [0, 1, 0],
  [0, 1, 0],
  [1, 1, 0]
]

export class JPiece extends BasePiece implements Piece {
  constructor(color: string, initialPosition: Position) {
    super(color, initialPosition, piece);
  }
}
