import { useCallback, useEffect, useRef, useState } from "react";
import { BoardModel } from "../models/board";
import { PieceGenerator } from "../models/pieces/pieces_factory";
import { Position } from "../models/position";
import { INITIAL_POSITION } from "../constants/positions";
import { Move, Piece, Turn } from "../models/pieces/piece_basic";
import { DEFAULT_TICK_SPEED } from "../constants/game_mechanics";
import { getGameOverPositions } from "../utils/game_mechanics";
import { AppState } from "react-native";

/**
 * Custom hook for managing a timer.
 *
 * @param callback - The function to be called on each tick of the timer.
 * @returns An object with functions and state variables related to the timer.
 */
export const useTimer = (callback: () => void) => {
  const timeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [tick, setTick] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [tickInterval, setTickInterval] = useState(DEFAULT_TICK_SPEED);

  const tooglePause = () => setIsPaused(!isPaused);

  const newStep = () => {
    if (isPaused) return;
    setTick({});
  };

  const clearTimer = () => timeout.current && clearTimeout(timeout.current);

  const updateTickInterval = (
    callback: (currentInterval: number) => number
  ) => {
    setTickInterval((tickInterval) => callback(tickInterval));
  };

  const resetTickInterval = () => setTickInterval(DEFAULT_TICK_SPEED);

  useEffect(() => {
    if (isPaused) {
      timeout.current && clearTimeout(timeout.current);
    } else {
      timeout.current = setTimeout(() => callback(), tickInterval);
    }
  }, [isPaused]);

  useEffect(() => {
    timeout.current = setTimeout(() => callback(), tickInterval);

    return () => timeout.current && clearTimeout(timeout.current);
  }, [tick]);

  const resetTimer = () => {
    clearTimer();
    setIsPaused(false);
    newStep();
  }

  return {
    tooglePause,
    newStep,
    clearTimer,
    isPaused,
    updateTickInterval,
    resetTimer
  };
};

/**
 * Custom hook for managing Tetris pieces.
 * @returns An object containing the current piece, next piece, and functions to load the next piece and restart the pieces.
 */
const useTetrisPiece = () => {
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

  const loadNextPiece = () => {
    setCurrentPiece(nextPiece);
    setNextPiece(
      PieceGenerator.generatePiece(
        new Position(INITIAL_POSITION.row, INITIAL_POSITION.column)
      )
    );
  };

  const restartPieces = () => {
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
  };

  return { currentPiece, nextPiece, loadNextPiece, restartPieces };
};

/**
 * Custom hook for managing the score in a Tetris game.
 * @returns An object containing the current score, a function to update the score, and a function to reset the score.
 */
const useScore = () => {
  const [score, setScore] = useState(0);

  const updateScore = (callback: (currentScore: number) => number) => {
    setScore((score) => callback(score));
  };

  const resetScore = () => setScore(0);

  return { score, updateScore, resetScore };
};
/**
 * Custom hook for managing the app state.
 * @returns An object containing the app state.
 */
const useAppState = (onGoingToBackground: () => void, onGoingToForeground: () => void) => {
  const [olderState, setOlderState] = useState<string | undefined>(undefined);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const listener = AppState.addEventListener("change", (nextAppState) => {
      console.log("App state changed to: ", nextAppState);
      if (olderState && olderState === "active" && nextAppState === "background") {
        onGoingToBackground();
      }
      if (olderState && olderState === "background" && nextAppState === "active") {
        onGoingToForeground();
      }
      setOlderState(nextAppState);
      appState.current = nextAppState;
    });

    return () => listener.remove();
  }, [olderState]);

  return appState;
}

/**
 * Custom hook for managing the Tetris game logic.
 * @returns An object containing various Tetris game functionalities.
 */
export const useTetris = () => {
  const [board, setBoard] = useState(new BoardModel());

  const { score, updateScore, resetScore } = useScore();

  //TODO: Change to false after desingning game over screen
  const [isGameOver, setIsGameOver] = useState(false);
  const { currentPiece, nextPiece, loadNextPiece, restartPieces } =
    useTetrisPiece();

  const gameOverPositions = useRef<Position[]>(
    getGameOverPositions(board.width)
  );

  const gameLoop = () => {
    const move = Move.down;
    const isMoved = handleMove(move);

    if (!isMoved) {
      if (checkGameOverRules()) {
        handleGameOver();
        return;
      }

      handlePieceMovement();
    }

    newStep();
  };

  const {
    newStep,
    tooglePause,
    clearTimer,
    isPaused,
    updateTickInterval,
    resetTimer
  } = useTimer(gameLoop);

  const checkGameOverRules = () =>
    board.arePositionsTaken(gameOverPositions.current);

  const handleMove = useCallback(
    (move: Move) => {
      const estimatedPositions =
        currentPiece.getEstimatedPositionAfterMove(move);

      if (
        !board.checkIfManyPositionsAreTaken(estimatedPositions, currentPiece)
      ) {
        updateBoardAfterMove(move);
        return true;
      } else {
        setBoard(board.copy());
        return false;
      }
    },
    [currentPiece, board]
  );

  const updateBoardAfterMove = (move: Move) => {
    board.clearPositions(currentPiece.getCurrentPositions());
    currentPiece.move(move);
    board.takePositions(currentPiece.getCurrentPositions(), currentPiece.color);
    setBoard(board.copy());
  };

  const handlePieceMovement = () => {
    loadNextPiece();
    const deleted = board.deleteFullRows();

    if (deleted > 0) {
      setBoard(board.copy());
      updateScoreAndTickInterval(deleted);
    }
  };

  const updateScoreAndTickInterval = (deleted: number) => {
    updateScore((score) => score + deleted * 100);
    updateTickInterval((tickInterval) =>
      tickInterval - 20 > 0 ? tickInterval - 20 : tickInterval
    );
  };

  const handleGameOver = () => {
    clearTimer();
    setIsGameOver(true);
  };

  const restartGame = () => {
    setBoard(new BoardModel());
    restartPieces();
    resetScore();
    setIsGameOver(false);
    resetTimer();
  };

  const turn = (turnDirection: Turn) => {
    if (!currentPiece.isHableToMove()) return;

    const estimatedPositions =
      currentPiece.getEstimatedPositionsAfterRotation(turnDirection);

    if (!board.checkIfManyPositionsAreTaken(estimatedPositions, currentPiece)) {
      updateBoardAfterRotation(turnDirection);
    }
  };

  const updateBoardAfterRotation = (turnDirection: Turn) => {
    board.clearPositions(currentPiece.getCurrentPositions());
    currentPiece.rotate(turnDirection);
    board.takePositions(currentPiece.getCurrentPositions(), currentPiece.color);
    setBoard(board.copy());
  };

  const pauseGame = () => tooglePause();

  const appState = useAppState(pauseGame, resetTimer);

  useEffect(() => {
    if (appState.current === "active") {
      console.log("App is active");
      console.log("Is paused: ", isPaused);
      console.log("Is game over: ", isGameOver);
      resetTimer();
    }
  }, [appState.current]);

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
  };
};
