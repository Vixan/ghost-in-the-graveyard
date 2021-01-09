import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import {
  findPath,
  getNextRandomAvailablePosition,
  getRandomAvailablePosition,
  isTargetInViewRadius
} from "../../utils/positionUtils";
import { useLatestState } from "../../utils/useLatestState";
import { GRID_CELL_SIZE } from "../Grid";
import { Agent } from "./Agent";
import { GhostBeliefs, GhostDesires } from "./Ghost";

export enum PlayerDesires {
  Wander,
  Escape,
  NotifyGhostFound,
  TurnIntoGhost
}

enum PlayerGender {
  Male,
  Female
}

const PLAYER_VIEW_RADIUS = 1;

export interface PlayerBeliefs {
  id: number;
  position: Position;
  desire: PlayerDesires;
  isWandering?: boolean;
  isEscaping?: boolean;
  isNotifyingGhostFound?: boolean;
  isCaught?: boolean;
  isTurnedToGhost?: boolean;
  displayViewArea?: boolean;
}

export const Player: FC<PlayerBeliefs> = ({
  id,
  position,
  isEscaping = false,
  isNotifyingGhostFound = false,
  isCaught = false,
  displayViewArea = false
}) => {
  const [gender, setGender] = useState<PlayerGender>(PlayerGender.Male);
  const [icon, setIcon] = useState<string>("");

  useEffect(() => {
    const gender =
      Math.random() > 0.5 ? PlayerGender.Male : PlayerGender.Female;

    setGender(gender);
    setIcon(gender === PlayerGender.Male ? "🚶‍♂️" : "🚶‍♀️");
  }, []);

  useEffect(() => {
    if (isEscaping) {
      setIcon(gender === PlayerGender.Male ? "🏃‍♂️" : "🏃‍♀️");
    }
  }, [gender, isEscaping]);

  useEffect(() => {
    if (isNotifyingGhostFound) {
      setIcon(gender === PlayerGender.Male ? "🧍‍♂️" : "🧍‍♀️");
    }
  }, [gender, isNotifyingGhostFound]);

  return (
    <Agent
      id={id}
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color={
        isNotifyingGhostFound ? "#ffee88" : isCaught ? "#CC5A71" : "#0a9dae"
      }
      text={icon}
      viewRadius={PLAYER_VIEW_RADIUS}
      displayViewArea={displayViewArea}
    />
  );
};

export const usePlayers = (
  binaryGrid: number[][],
  exitPosition: Position,
  playerCount: number
) => {
  const [players, setPlayers, getLatestPlayers] = useLatestState<
    PlayerBeliefs[]
  >([]);

  const resetPlayers = () => {
    const playersToCreate: PlayerBeliefs[] = [...Array(playerCount).keys()].map(
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
          isWandering: true,
          isEscaping: false,
          isNotifyingGhostFound: false,
          isCaught: false,
          desire: PlayerDesires.Wander
        };
      }
    );

    setPlayers(playersToCreate);
  };

  useEffect(() => {
    resetPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCount]);

  const inferDesires = (
    player: PlayerBeliefs,
    ghosts: GhostBeliefs[]
  ): PlayerDesires => {
    if (player.isCaught) {
      return PlayerDesires.TurnIntoGhost;
    }

    if (players.some(p => p.isNotifyingGhostFound && p.id !== player.id)) {
      return PlayerDesires.Escape;
    }

    if (
      ghosts.some(g =>
        isTargetInViewRadius(player.position, g.position, PLAYER_VIEW_RADIUS)
      ) &&
      player.isWandering &&
      !players.some(p => p.isNotifyingGhostFound)
    ) {
      return PlayerDesires.NotifyGhostFound;
    }

    return player.desire;
  };

  const wander = (binaryGrid: number[][], player: PlayerBeliefs) => {
    const randomPosition = getNextRandomAvailablePosition(
      binaryGrid,
      player.position
    );

    if (randomPosition) {
      binaryGrid[randomPosition.y][randomPosition.x] = 1;
      binaryGrid[player.position.y][player.position.x] = 0;
    }

    return {
      ...player,
      position: randomPosition ?? player.position
    };
  };

  const escapeToExit = (
    binaryGrid: number[][],
    player: PlayerBeliefs,
    ghosts: GhostBeliefs[]
  ) => {
    const pathToExit = findPath(
      binaryGrid,
      player.position,
      exitPosition
    )?.slice(1)?.[0];

    if (!player.isNotifyingGhostFound && pathToExit?.length > 0) {
      const isPlayerCaughtByGhost = ghosts.some(g =>
        isTargetInViewRadius(player.position, g.position, PLAYER_VIEW_RADIUS)
      );
      if (isPlayerCaughtByGhost) {
        return {
          ...player,
          isCaught: true,
          isEscaping: false,
          isWandering: false
        };
      }

      return {
        ...player,
        position: { x: pathToExit[0], y: pathToExit[1] },
        isEscaping: true
      };
    }

    return player;
  };

  const notifyGhostFound = (player: PlayerBeliefs) => {
    return {
      ...player,
      isNotifyingGhostFound: true,
      isWandering: false
    };
  };

  const turnIntoGhost = (
    player: PlayerBeliefs,
    ghosts: GhostBeliefs[],
    setGhosts: (ghosts: GhostBeliefs[]) => void
  ) => {
    const playerTurnedToGhost: GhostBeliefs = {
      id: ghosts.length,
      desire: GhostDesires.Wander,
      position: player.position,
      displayViewArea: player.displayViewArea
    };
    setGhosts([...ghosts, playerTurnedToGhost]);

    return {
      ...player,
      isWandering: false,
      isTurnedToGhost: true
    };
  };

  const updatePlayers = (
    binaryGrid: number[][],
    exitPosition: Position,
    ghosts: GhostBeliefs[],
    setGhosts: (ghosts: GhostBeliefs[]) => void
  ) => {
    const playersToUpdate = players
      .map(player => ({
        ...player,
        desire: inferDesires(player, ghosts)
      }))
      .map(player => {
        if (player.desire === PlayerDesires.Wander) {
          return wander(binaryGrid, player);
        } else if (player.desire === PlayerDesires.NotifyGhostFound) {
          return notifyGhostFound(player);
        } else if (player.desire === PlayerDesires.Escape) {
          return escapeToExit(binaryGrid, player, ghosts);
        } else if (player.desire === PlayerDesires.TurnIntoGhost) {
          return turnIntoGhost(player, ghosts, setGhosts);
        }

        return player;
      });

    const playersInGame = playersToUpdate.filter(
      p =>
        !(
          p.isEscaping &&
          p.position.x === exitPosition.x &&
          p.position.y === exitPosition.y
        ) && !p.isTurnedToGhost
    );

    setPlayers(playersInGame);
  };

  return { players, setPlayers, getLatestPlayers, updatePlayers, resetPlayers };
};
