import { TetrisMath } from "../../utils/math";
import { Position } from "../position";
import { JPiece } from "./j_piece";
import { LPiece } from "./l_piece";
import { Line } from "./line_piece";
import { Piece, PieceType } from "./piece_basic";
import { SPiece } from "./s_piece";
import { Square } from "./square_piece";
import { TPiece } from "./t_piece";
import { ZPiece } from "./z_piece";

export class PieceFactory {
    static createPiece(type: PieceType, color: string, initialPosition: Position): Piece {
      switch (type) {
        case PieceType.square:
          return new Square(color, initialPosition);
        case PieceType.line:
          return new Line(color, initialPosition);
        case PieceType.t:
          return new TPiece(color, initialPosition);
        case PieceType.l:
          return new LPiece(color, initialPosition);
        case PieceType.j:
          return new JPiece(color, initialPosition);
        case PieceType.s:
          return new SPiece(color, initialPosition);
        case PieceType.z:
          return new ZPiece(color, initialPosition);
        default:
          return new Square(color, initialPosition);
      }
    }
  }
  
  export class PieceGenerator {
    static generatePiece(initialPosition: Position): Piece {
      const random = TetrisMath.getRandomInt(0, 7);
      switch (random) {
        case 0:
          return PieceFactory.createPiece(PieceType.square, "green", initialPosition);
        case 1:
          return PieceFactory.createPiece(PieceType.line, "red", initialPosition);
        case 2:
          return PieceFactory.createPiece(PieceType.t, "blue", initialPosition);
        case 3:
          return PieceFactory.createPiece(PieceType.l, "yellow", initialPosition);
        case 4:
          return PieceFactory.createPiece(PieceType.j, "orange", initialPosition);
        case 5:
          return PieceFactory.createPiece(PieceType.s, "purple", initialPosition);
        case 6:
          return PieceFactory.createPiece(PieceType.z, "pink", initialPosition);
        default:
          return PieceFactory.createPiece(PieceType.square, "red", initialPosition);
      }
    }
  }