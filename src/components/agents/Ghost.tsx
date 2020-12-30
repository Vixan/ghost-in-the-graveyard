import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import {
  getNextRandomAvailablePosition,
  getRandomAvailablePosition
} from "../../utils/agentUtils";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "../Grid";
import { PlayerBeliefs } from "./Player";

export enum GhostPlan {
  Wander,
  ChasePlayer
}

export interface GhostBeliefs {
  id: number;
  position: Position;
  plan: GhostPlan;
  isFound?: boolean;
  displayViewArea?: boolean;
}

export const Ghost: FC<GhostBeliefs> = ({
  id,
  position,
  plan,
  isFound = false,
  displayViewArea = false
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
      displayViewArea={displayViewArea}
    />
  );
};

export const useGhosts = (ghostCount: number) => {
  const [ghosts, setGhosts] = useState<GhostBeliefs[]>([]);

  useEffect(() => {
    const ghostsToCreate: GhostBeliefs[] = [...Array(ghostCount).keys()].map(
      i => ({
        id: i,
        position: getRandomAvailablePosition(),
        isFound: false,
        plan: GhostPlan.Wander
      })
    );

    setGhosts(ghostsToCreate);
  }, [ghostCount]);

  const renderGhosts = (displayViewArea?: boolean) =>
    ghosts.map(ghost => (
      <Ghost
        key={ghost.id}
        id={ghost.id}
        position={ghost.position}
        plan={ghost.plan}
        isFound={ghost.isFound}
        displayViewArea={displayViewArea}
      />
    ));

  const updateGhosts = (binaryGrid: number[][], players: PlayerBeliefs[]) => {
    const ghostsToUpdate = ghosts.map(ghost => {
      if (players.some(player => player.position === ghost.position)) {
        return {
          ...ghost,
          isFound: true,
          plan: GhostPlan.ChasePlayer
        };
      }

      if (ghost.plan === GhostPlan.Wander) {
        return {
          ...ghost,
          position: getNextRandomAvailablePosition(binaryGrid, ghost.position)
        };
      }

      return ghost;
    });

    setGhosts(ghostsToUpdate);
  };

  return { ghosts, setGhosts, renderGhosts, updateGhosts };
};
