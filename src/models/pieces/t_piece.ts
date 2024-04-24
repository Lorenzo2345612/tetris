import { Position } from "../position";
import { BasePiece, Piece, Turn } from "./piece_basic";

const piece = [
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 0]
]

export class TPiece extends BasePiece implements Piece {
  constructor(color: string, initialPosition: Position) {
    super(color, initialPosition, piece);
  }
}
