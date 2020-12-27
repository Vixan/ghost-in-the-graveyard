import React, { FC, useEffect, useState } from "react";
import { Position } from "../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "./Grid";

export enum PlayerPlan {
  Wander,
  Escape
}

export interface PlayerBeliefs {
  id: number;
  position: Position;
  plan: PlayerPlan;
  isEscaping?: boolean;
}

export const Player: FC<PlayerBeliefs> = ({
  id,
  position,
  plan,
  isEscaping = false
}) => {
  const [playerIcon, setPlayerIcon] = useState<string>("🧍‍♂️");

  useEffect(() => {
    setPlayerIcon(Math.random() > 0.5 ? "🧍‍♂️" : "🧍‍♀️");
  }, []);

  return (
    <Agent
      id={id}
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#0a9dae"
      text={playerIcon}
    />
  );
};
