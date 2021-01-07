export const createEmptyGrid = (height: number, width: number) =>
  new Array(height).fill(0).map(() => new Array(width).fill(0));
