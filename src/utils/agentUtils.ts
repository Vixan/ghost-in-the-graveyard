import { GridSize } from "../types/grid";
import { Position } from "../types/position";

const random = (max: number) => Math.floor(Math.random() * max);

// INFO: Move Up, Down, Left or Right
export const getRandomAgentPosition = (
  currentPosition: Position,
  gridSize: GridSize
) => {
  const randomMovementDirection = random(4);
  let { x, y } = currentPosition;
  let { width, height } = gridSize;

  if (randomMovementDirection === 0 && x < width) {
    x = x + 1;
  }

  if (randomMovementDirection === 1 && x > 0) {
    x = x - 1;
  }

  if (randomMovementDirection === 2 && y < height) {
    y = y + 1;
  }

  if (randomMovementDirection === 3 && y > 0) {
    y = y - 1;
  }

  return { x, y };
};
