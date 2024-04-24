import { Position } from "../position";
import { BasePiece, Piece, Turn } from "./piece_basic";

const piece = [
  [0,0,0],
  [1,1,0],
  [0,1,1]
]

export class ZPiece extends BasePiece implements Piece {
  constructor(color: string, initialPosition: Position) {
    super(color, initialPosition, piece);
  }
  
  }