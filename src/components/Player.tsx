import React, { FC } from "react";
import { Position } from "../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "./Grid";

export type PlayerPlan = "Wander" | "Escape";

export interface PlayerBeliefs {
  id: number;
  position: Position;
  plan: PlayerPlan;
  isFound?: boolean;
}

export const Player: FC<PlayerBeliefs> = ({
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
      color="#0a9dae"
      text={`🧍‍♂️`}
    />
  );
};
