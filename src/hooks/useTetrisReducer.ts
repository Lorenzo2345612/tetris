import { useCallback, useEffect, useRef, useState } from "react";
import { BoardModel } from "../models/board";
import { PieceGenerator } from "../models/pieces/pieces_factory";
import { Position } from "../models/position";
import { INITIAL_POSITION } from "../constants/positions";
import { Move, Piece, Turn } from "../models/pieces/piece_basic";
import { DEFAULT_TICK_SPEED } from "../constants/game_mechanics";
import { getGameOverPositions } from "../utils/game_mechanics";

export interface GameState {
  board: BoardModel;
  currentPiece: Piece;
  nextPiece: Piece;
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
}

export const useTetris = () => {
  const [board, setBoard] = useState(new BoardModel());
  const [currentPiece, setCurrentPiece] = useState<Piece>(
    PieceGenerator.generatePiece(
      new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
    )
  );
  const [nextPiece, setNextPiece] = useState<Piece>(
    PieceGenerator.generatePiece(
      new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
    )
  );
  const [tick, setTick] = useState({});
  const [score, setScore] = useState(0);
  const [tickInterval, setTickInterval] = useState(DEFAULT_TICK_SPEED);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const gameOverPositions = useRef<Position[]>(getGameOverPositions(board.width));

  const gameLoop = () => {
    const move = Move.down;
    const isMoved = handleMove(move);
    if (!isMoved) {
      if (checkGameOverRules()) {
        timeout.current && clearTimeout(timeout.current);
        setIsGameOver(true);
        return;
      }
      setCurrentPiece(nextPiece);
      setNextPiece(
        PieceGenerator.generatePiece(
          new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
        )
      );
      const deleted = board.deleteFullRows();
      if (deleted > 0) {
        setBoard(board.copy());
        setScore((score) => score + deleted * 100);
        setTickInterval((tickInterval) => {
          return tickInterval - 20 > 0 ? tickInterval - 20 : tickInterval;
        });
      }
    }
    setTick({});
  };

  const checkGameOverRules = () => {
    const isGameOver = board.arePositionsTaken(gameOverPositions.current);
    return isGameOver;
  };

  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleMove = useCallback((move: Move) => {
    const estimatedPositions = currentPiece.getEstimatedPositionAfterMove(move);
    if (!board.checkIfManyPositionsAreTaken(estimatedPositions, currentPiece)) {
      board.clearPositions(currentPiece.getCurrentPositions());
      currentPiece.move(move);
      board.takePositions(
        currentPiece.getCurrentPositions(),
        currentPiece.color
      );
      setBoard(board.copy());
      return true;
    } else {
      setBoard(board.copy());
      return false;
    }
  }, [currentPiece, board]);

  const restartGame = () => {
    timeout.current && clearTimeout(timeout.current);
    setBoard(new BoardModel());
    setCurrentPiece(
      PieceGenerator.generatePiece(
        new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
      )
    );
    setNextPiece(
      PieceGenerator.generatePiece(
        new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
      )
    );
    setScore(0);
    setIsGameOver(false);
    setTick({});
    setTickInterval(DEFAULT_TICK_SPEED);
  };

  const getGameState = () => {
    return {board, currentPiece, nextPiece, score, isPaused, isGameOver};
  }

  const setGameState = (gameState: GameState) => {
    setBoard(BoardModel.copyBoard(gameState.board));
    setCurrentPiece(gameState.currentPiece);
    setNextPiece(gameState.nextPiece);
    setScore(gameState.score);
    setIsPaused(true);
    setIsGameOver(gameState.isGameOver);
  }

  useEffect(() => {
    if (isPaused) {
      timeout.current && clearTimeout(timeout.current);
    } else {
      timeout.current = setTimeout(() => {
        gameLoop();
      }, tickInterval);
    }
  }, [isPaused]),
    useEffect(() => {
      timeout.current = setTimeout(() => {
        gameLoop();
      }, tickInterval);
      return () => {
        timeout.current && clearTimeout(timeout.current);
      };
    }, [tick]);

  const turn = (turnDirection: Turn) => {
    if (!currentPiece.isHableToMove()) return;
    const estimatedPositions =
      currentPiece.getEstimatedPositionsAfterRotation(turnDirection);
    if (!board.checkIfManyPositionsAreTaken(estimatedPositions, currentPiece)) {
      board.clearPositions(currentPiece.getCurrentPositions());
      currentPiece.rotate(Turn.Right);
      board.takePositions(
        currentPiece.getCurrentPositions(),
        currentPiece.color
      );
      setBoard(board.copy());
    }
  };

  const pauseGame = () => {
    setIsPaused(!isPaused);
  };

  return {
    restartGame,
    pauseGame,
    turn,
    handleMove,
    board,
    currentPiece,
    nextPiece,
    score,
    isPaused,
    isGameOver,
    getGameState,
    setGameState
  };
};
