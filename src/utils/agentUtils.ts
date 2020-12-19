import { Position } from "../types/position";
import { GRID_SIZE } from "../types/grid";

const random = (max: number) => Math.floor(Math.random() * max);

// INFO: Move Up, Down, Left or Right
export const getRandomAgentPosition = (currentPosition: Position) => {
  const randomMovementDirection = random(4);
  let { x, y } = currentPosition;
  let { width, height } = GRID_SIZE;

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
