export interface GridSize {
  width: number;
  height: number;
}

export const GRID_CELL_SIZE = 50;
export const GRID_SIZE: GridSize = Object.freeze({ width: 10, height: 10 });
