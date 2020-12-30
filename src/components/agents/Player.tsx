import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "../Grid";
import { findPath, getRandomAvailablePosition } from "../../utils/agentUtils";

export enum PlayerPlan {
  Wander,
  Escape
}

export interface PlayerBeliefs {
  id: number;
  position: Position;
  plan: PlayerPlan;
  isEscaping?: boolean;
  displayViewArea?: boolean
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

export const usePlayers = (playerCount: number) => {
  const [players, setPlayers] = useState<PlayerBeliefs[]>([]);

  useEffect(() => {
    const playersToCreate: PlayerBeliefs[] = [...Array(playerCount).keys()].map(
      i => ({
        id: i,
        position: getRandomAvailablePosition(),
        isFound: false,
        plan: PlayerPlan.Wander
      })
    );

    setPlayers(playersToCreate);
  }, [playerCount]);

  const renderPlayers = (displayViewArea?: boolean) => players.map(player => (
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
          !(p.position.x === exitPosition.x && p.position.y === exitPosition.y)
      )
    );
  };

  return { players, setPlayers, renderPlayers, updatePlayers };
};
