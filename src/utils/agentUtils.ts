import { Position } from "../types/position";
import { GRID_SIZE } from "../components/Grid";
import PF from "pathfinding";

const random = (max: number) => Math.floor(Math.random() * max);

export const getNextRandomAvailablePosition = (
  binaryGrid: number[][],
  currentPosition: Position
) => {
  const { x, y } = currentPosition;

  // INFO: Move Up, Down, Left or Right
  const possibleNextPositions = [
    { x, y: y - 1 },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x - 1, y }
  ].filter(({ x, y }) => binaryGrid[y]?.[x] === 0);

  const randomMovementDirection = random(possibleNextPositions.length);

  return possibleNextPositions[randomMovementDirection];
};

export const getRandomAvailablePosition = () => {
  let { width, height } = GRID_SIZE;

  return { x: random(width - 1), y: random(height - 1) };
};

// export const getRandomAvailablePosition = (
//   binaryGrid: number[][],
//   exitPosition: Position
// ) => {
//   const availablePositions: Position[] = [];

//   for (let row = 0; row < binaryGrid.length; row++) {
//     for (let col = 0; col < binaryGrid[row].length; col++) {
//       if (
//         !binaryGrid[row][col] &&
//         row !== exitPosition.x &&
//         col !== exitPosition.y
//       ) {
//         availablePositions.push({ x: row, y: col });
//       }
//     }
//   }

//   return availablePositions[random(availablePositions.length)];
// };

export const findPath = (
  binaryGrid: number[][],
  startCell: Position,
  endCell: Position
): number[][] => {
  const grid = new PF.Grid(binaryGrid);

  const finder = new PF.AStarFinder();
  const path = finder.findPath(
    startCell.x,
    startCell.y,
    endCell.x,
    endCell.y,
    grid
  );

  return path;
};
