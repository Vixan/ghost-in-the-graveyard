import React, { FC, useEffect } from "react";
import { Position } from "../../types/position";
import {
  findPath,
  getNextRandomAvailablePosition,
  getRandomAvailablePosition,
  isTargetInViewRadius
} from "../../utils/agentUtils";
import { useLatestState } from "../../utils/useLatestState";
import { GRID_CELL_SIZE } from "../Grid";
import { Agent } from "./Agent";
import { PlayerBeliefs } from "./Player";

export enum GhostDesires {
  Wander,
  ChasePlayers
}

const GHOST_VIEW_RADIUS = 1;

export interface GhostBeliefs {
  id: number;
  position: Position;
  desire: GhostDesires;
  isWandering?: boolean;
  isFound?: boolean;
  displayViewArea?: boolean;
}

export const Ghost: FC<GhostBeliefs> = ({
  id,
  position,
  desire,
  isWandering = true,
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
  initialBinaryGrid: number[][],
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
          initialBinaryGrid,
          exitPosition
        );

        if (randomPosition) {
          initialBinaryGrid[randomPosition.y][randomPosition.x] = 1;
        }

        return {
          id: i,
          position: randomPosition,
          isFound: false,
          isWandering: true,
          desire: GhostDesires.Wander
        };
      }
    );

    setGhosts(ghostsToCreate.filter(t => t.position));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ghostCount]);

  const inferDesires = (
    ghost: GhostBeliefs,
    players: PlayerBeliefs[]
  ): GhostDesires => {
    if (
      ghost.isWandering &&
      players.some(
        player =>
          player.isWandering &&
          isTargetInViewRadius(
            ghost.position,
            player.position,
            GHOST_VIEW_RADIUS
          )
      )
    ) {
      return GhostDesires.ChasePlayers;
    }

    if (ghost.isWandering) {
      return GhostDesires.Wander;
    }

    return ghost.desire;
  };

  const wander = (binaryGrid: number[][], ghost: GhostBeliefs) => {
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
  };

  // FIXME: Player overlapping with Ghost when escaping
  const chasePlayers = (
    binaryGrid: number[][],
    ghost: GhostBeliefs,
    players: PlayerBeliefs[]
  ) => {
    const pathsToAllPlayers = players.map(p => {
      // INFO: Dirty fix to make sure the target player is on a walkable cell
      const binaryGridClone = JSON.parse(JSON.stringify(binaryGrid));
      binaryGridClone[p.position.y][p.position.x] = 0;

      return findPath(binaryGridClone, ghost.position, p.position)?.slice(
        1
      )?.[0];
    });
    
    if (pathsToAllPlayers[0]?.length > 0) {
      const pathToClosestPlayer = pathsToAllPlayers.reduce(
        (closestPath, currentPath) =>
          currentPath?.length > closestPath?.length ? currentPath : closestPath,
        pathsToAllPlayers[0] ?? Infinity
      );

      if (pathToClosestPlayer) {
        return {
          ...ghost,
          position: { x: pathToClosestPlayer[0], y: pathToClosestPlayer[1] },
          isFound: true,
          isWandering: false
        };
      }
    }

    return { ...ghost, isWandering: false, isFound: true };
  };

  const updateGhosts = (binaryGrid: number[][], players: PlayerBeliefs[]) => {
    const ghostsToUpdate = ghosts
      .map(ghost => ({ ...ghost, desire: inferDesires(ghost, players) }))
      .map(ghost => {
        if (ghost.desire === GhostDesires.Wander) {
          return wander(binaryGrid, ghost);
        } else if (ghost.desire === GhostDesires.ChasePlayers) {
          return chasePlayers(
            binaryGrid,
            ghost,
            players.filter(p => p.isEscaping)
          );
        }

        return ghost;
      });

    setGhosts(ghostsToUpdate);
  };

  return { ghosts, getLatestGhosts, setGhosts, updateGhosts };
};
