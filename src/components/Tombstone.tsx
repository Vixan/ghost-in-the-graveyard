import React, { FC } from "react";
import { Position } from "../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "./Grid";

export interface TombstoneBeliefs {
  id: number;
  position: Position;
}

export const Tombstone: FC<TombstoneBeliefs> = ({
  id,
  position,
}) => {
  return (
    <Agent
      id={id}
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#292A2D"
      text="⬛"
    />
  );
};
