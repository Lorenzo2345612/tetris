import { Position } from "../models/position";

export const getGameOverPositions = (width: number) => {
    const positions: Position[] = [];
    for (let i = 0; i < width; i++) {
        positions.push(new Position(4, i));
    }
    return positions;
}