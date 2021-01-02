import React, { FC, useEffect } from "react";
import { Position } from "../../types/position";
import {
  getNextRandomAvailablePosition,
  getRandomAvailablePosition
} from "../../utils/agentUtils";
import { useLatestState } from "../../utils/useLatestState";
import { GRID_CELL_SIZE } from "../Grid";
import { Agent } from "./Agent";
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

export const useGhosts = (
  binaryGrid: number[][],
  exitPosition: Position,
  ghostCount: number
) => {
  const [ghosts, setGhosts, getLatestGhosts] = useLatestState<GhostBeliefs[]>(
    []
  );

  useEffect(() => {
    const ghostsToCreate: GhostBeliefs[] = [...Array(ghostCount).keys()].map(
      i => {
        const randomPosition = getRandomAvailablePosition(
          binaryGrid,
          exitPosition
        );

        if (randomPosition) {
          binaryGrid[randomPosition.y][randomPosition.x] = 1;
        }

        return {
          id: i,
          position: randomPosition,
          isFound: false,
          plan: GhostPlan.Wander
        };
      }
    );

    setGhosts(ghostsToCreate.filter(t => t.position));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghostCount]);

  const updateGhosts = (binaryGrid: number[][], players: PlayerBeliefs[]) => {
    const ghostsToUpdate = ghosts.map(ghost => {
      if (ghost.plan === GhostPlan.Wander) {
        const randomPosition = getNextRandomAvailablePosition(
          binaryGrid,
          ghost.position
        );

        if (randomPosition) {
          binaryGrid[randomPosition.y][randomPosition.x] = 1;
          binaryGrid[ghost.position.y][ghost.position.x] = 0;
        }

        return {
          ...ghost,
          position: randomPosition ?? ghost.position
        };
      }

      if (players.some(player => player.position === ghost.position)) {
        return {
          ...ghost,
          isFound: true,
          plan: GhostPlan.ChasePlayer
        };
      }

      return ghost;
    });

    setGhosts(ghostsToUpdate);
  };

  return { ghosts, getLatestGhosts, setGhosts, updateGhosts };
};
