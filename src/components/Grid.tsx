import React, { FC } from "react";
import { Group, Rect } from "react-konva";

export interface GridSize {
  width: number;
  height: number;
}

export const GRID_CELL_SIZE = 50;

interface Props {
  cellSize: number;
  cellBorderColor: string;
  cellFillColor: string;
  rows: number;
  cols: number;
}

export const Grid: FC<Props> = ({
  cellSize,
  cellBorderColor,
  cellFillColor,
  rows,
  cols
}) => {
  const cells = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      cells.push({
        row: row * cellSize,
        col: col * cellSize,
        key: `cell-${row}-${col}`
      });
    }
  }

  return (
    <Group>
      {cells.map(cell => (
        <Rect
          x={cell.col}
          y={cell.row}
          width={cellSize}
          height={cellSize}
          key={cell.key}
          stroke={cellBorderColor}
          strokeWidth={10}
          fill={cellFillColor}
          className="m-5"
          opacity={0.5}
          cornerRadius={10}
        />
      ))}
    </Group>
  );
};
