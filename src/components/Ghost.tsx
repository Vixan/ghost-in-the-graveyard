import React, { FC } from "react";
import { GhostAgent } from "../types/ghostAgent";
import { GRID_CELL_SIZE } from "../types/grid";
import { Agent } from "./Agent";

interface Props extends GhostAgent {}

export const Ghost: FC<Props> = ({ id, position }) => {
  return (
    <Agent
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#CC5A71"
      text={`Ghost ${id}`}
    />
  );
};
