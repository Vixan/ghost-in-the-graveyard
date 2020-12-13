import React, { FC } from "react";
import { Layer, Rect, Stage } from "react-konva";

const CELL_SIZE = 50;
const CELL_BORDER_COLOR="#333333";

export const App: FC<{}> = () => {
  const renderGrid = () => {
    const cells = [];

    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 12; col++) {
        cells.push({
          row: row * CELL_SIZE,
          col: col * CELL_SIZE,
          key: `cell-${row}-${col}`
        });
      }
    }

    return (
      <Layer className="border-2">
        {cells.map(cell => (
          <Rect
            x={cell.row}
            y={cell.col}
            width={CELL_SIZE}
            height={CELL_SIZE}
            key={cell.key}
            stroke={CELL_BORDER_COLOR}
            strokeWidth={1}
          />
        ))}
      </Layer>
    );
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-800">
      <Stage width={600} height={600} className="p-4 bg-gray-500 shadow-2xl">
        {renderGrid()}

        <Layer></Layer>
      </Stage>
    </div>
  );
};
