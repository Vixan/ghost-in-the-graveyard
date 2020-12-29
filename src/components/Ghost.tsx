import React, { FC } from "react";
import { Position } from "../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "./Grid";

export enum GhostPlan {
  Wander,
  ChasePlayer
}

export interface GhostBeliefs {
  id: number;
  position: Position;
  plan: GhostPlan;
  isFound?: boolean;
}

export const Ghost: FC<GhostBeliefs> = ({
  id,
  position,
  plan,
  isFound = false
}) => {
  return (
    <Agent
      id={id}
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#CC5A71"
      text={`👻`}
      viewRadius={1}
    />
  );
};
