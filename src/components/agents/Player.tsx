import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import {
  findPath,
  getNextRandomAvailablePosition,
  getRandomAvailablePosition
} from "../../utils/agentUtils";
import { GRID_CELL_SIZE } from "../Grid";
import { Agent } from "./Agent";

export enum PlayerPlan {
  Wander,
  Escape
}

export interface PlayerBeliefs {
  id: number;
  position: Position;
  plan: PlayerPlan;
  isEscaping?: boolean;
  displayViewArea?: boolean;
}

export const Player: FC<PlayerBeliefs> = ({
  id,
  position,
  plan,
  isEscaping = false,
  displayViewArea = false
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
      viewRadius={1}
      displayViewArea={displayViewArea}
    />
  );
};

export const usePlayers = (
  binaryGrid: number[][],
  exitPosition: Position,
  playerCount: number
) => {
  const [players, setPlayers] = useState<PlayerBeliefs[]>([]);

  useEffect(() => {
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
          isEscaping: false,
          plan: PlayerPlan.Wander
        };
      }
    );

    setPlayers(playersToCreate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerCount]);

  const renderPlayers = (displayViewArea?: boolean) =>
    players.map(player => (
      <Player
        key={player.id}
        id={player.id}
        position={player.position}
        plan={player.plan}
        isEscaping={player.isEscaping}
        displayViewArea={displayViewArea}
      />
    ));

  const updatePlayers = (binaryGrid: number[][], exitPosition: Position) => {
    const playersToUpdate = players.map(player => {
      if (player.plan === PlayerPlan.Wander) {
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
      }

      if (player.plan === PlayerPlan.Escape) {
        const pathToExit = findPath(
          binaryGrid,
          player.position,
          exitPosition
        )?.slice(1)?.[0];

        if (pathToExit?.length > 0) {
          return {
            ...player,
            position: { x: pathToExit[0], y: pathToExit[1] }
          };
        }
      }

      return player;
    });

    setPlayers(
      playersToUpdate.filter(
        p =>
          !(
            p.isEscaping &&
            p.position.x === exitPosition.x &&
            p.position.y === exitPosition.y
          )
      )
    );
  };

  return { players, setPlayers, renderPlayers, updatePlayers };
};
