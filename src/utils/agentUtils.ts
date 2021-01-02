import PF from "pathfinding";
import { Position } from "../types/position";

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

// TODO: Use "E" as a marker on the grid for the exit instead of passing it as a parameter
export const getRandomAvailablePosition = (
  binaryGrid: number[][],
  exitPosition: Position
) => {
  const availablePositions: Position[] = [];

  for (let row = 0; row < binaryGrid.length; row++) {
    for (let col = 0; col < binaryGrid[row].length; col++) {
      if (
        !binaryGrid[row][col] &&
        !(row === exitPosition.y && col === exitPosition.x)
      ) {
        availablePositions.push({ x: col, y: row });
      }
    }
  }

  return availablePositions[random(availablePositions.length)];
};

export const isTargetInViewRadius = (
  source: Position,
  target: Position,
  viewRadius: number
) => {
  return (
    (source.x === target.x && source.y + viewRadius === target.y) ||
    (source.y === target.y && source.x + viewRadius === target.x) ||
    (source.x === target.x && source.y - viewRadius === target.y) ||
    (source.y === target.y && source.x - viewRadius === target.x)
  );
};

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

export const createEmptyGrid = (height: number, width: number) =>
  new Array(height).fill(0).map(() => new Array(width).fill(0));
