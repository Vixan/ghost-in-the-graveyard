import React, { FC, useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import styled, { css } from "styled-components";
import { Exit } from "./components/Exit";
import { Ghost, GhostBeliefs, GhostPlan } from "./components/Ghost";
import { Grid, GRID_CELL_SIZE, GRID_SIZE } from "./components/Grid";
import { Player, PlayerBeliefs, PlayerPlan } from "./components/Player";
import { Tombstone, TombstoneBeliefs } from "./components/Tombstone";
import { Position } from "./types/position";
import {
  getRandomAgentPosition,
  getRandomInitialAgentPosition
} from "./utils/agentUtils";
import PF from "pathfinding";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  height: 100vh;
  background-color: #35363a;
`;

const PlayButton = styled.button<{ paused: boolean }>`
  border: none;
  padding: 0.5rem;
  width: 10rem;
  border-radius: 10px;
  background-color: #1d1d20;
  color: #0dab76;
  margin-bottom: 2rem;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  outline: none;

  ${({ paused }: any) =>
    paused &&
    css`
      background-color: #ffee88;
      color: #000000;
    `}
`;

const GHOST_COUNT = 2;
const PLAYER_COUNT = 3;
const TOMBSTONES_COUNT = 8;
const EXIT_POSITION: Position = {
  x: GRID_SIZE.height / 2 - 1,
  y: GRID_SIZE.width - 1
};

enum SimulationStatus {
  Running,
  Paused,
  Ended
}

export const App: FC<{}> = () => {
  const [simulationStatus, setSimulationStatus] = useState(
    SimulationStatus.Paused
  );
  const [ghosts, setGhosts] = useState<GhostBeliefs[]>([]);
  const [players, setPlayers] = useState<PlayerBeliefs[]>([]);
  const [tombstones, setTombstones] = useState<TombstoneBeliefs[]>([]);

  useEffect(() => {
    const ghostsToCreate: GhostBeliefs[] = [...Array(GHOST_COUNT).keys()].map(
      i => ({
        id: i,
        position: getRandomInitialAgentPosition(),
        isFound: false,
        plan: GhostPlan.Wander
      })
    );

    setGhosts(ghostsToCreate);

    const playersToCreate: PlayerBeliefs[] = [
      ...Array(PLAYER_COUNT).keys()
    ].map(i => ({
      id: i,
      position: getRandomInitialAgentPosition(),
      isFound: false,
      plan: PlayerPlan.Wander
    }));

    setPlayers(playersToCreate);

    const tombstonesToCreate: TombstoneBeliefs[] = [
      ...Array(TOMBSTONES_COUNT).keys()
    ].map(i => ({
      id: i,
      position: getRandomInitialAgentPosition()
    }));

    setTombstones(tombstonesToCreate);
  }, []);

  useEffect(() => {
    const findPath = (startCell: Position, endCell: Position): number[][] => {
      let map = new Array(GRID_SIZE.width)
        .fill(0)
        .map(() => new Array(GRID_SIZE.height).fill(0));

      ghosts.forEach(ghost => {
        map[ghost.position.y][ghost.position.x] = 1;
      });
      players.forEach(player => {
        map[player.position.y][player.position.x] = 1;
      });
      tombstones.forEach(tombstone => {
        map[tombstone.position.y][tombstone.position.x] = 1;
      });

      const grid = new PF.Grid(map);

      const finder = new PF.AStarFinder();
      const path = finder.findPath(
        startCell.x,
        startCell.y,
        endCell.x,
        endCell.y,
        grid
      );

      return path;
    };

    const updateGhosts = () => {
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
            position: getRandomAgentPosition(ghost.position)
          };
        }

        return ghost;
      });

      setGhosts(ghostsToUpdate);
    };

    const updatePlayers = () => {
      const playersToUpdate = players.map(player => {
        if (player.plan === PlayerPlan.Wander) {
          const pathToExit = findPath(player.position, EXIT_POSITION)?.slice(
            1
          )?.[0];

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
              p.position.x === EXIT_POSITION.x &&
              p.position.y === EXIT_POSITION.y
            )
        )
      );
    };

    if (simulationStatus !== SimulationStatus.Running) {
      return;
    }

    const reasoningLoop = setInterval(() => {
      updateGhosts();
      updatePlayers();
    }, 500);

    return () => {
      clearInterval(reasoningLoop);
    };
  }, [ghosts, players, tombstones, simulationStatus]);

  const toggleSimulationStatus = () => {
    if (simulationStatus === SimulationStatus.Running) {
      setSimulationStatus(SimulationStatus.Paused);
    } else if (simulationStatus === SimulationStatus.Paused) {
      setSimulationStatus(SimulationStatus.Running);
    }
  };

  return (
    <Wrapper>
      <PlayButton
        onClick={toggleSimulationStatus}
        paused={simulationStatus === SimulationStatus.Paused}>
        {simulationStatus === SimulationStatus.Running
          ? "⚡ Running"
          : "⏸ Paused"}
      </PlayButton>
      <Stage
        width={GRID_SIZE.width * GRID_CELL_SIZE}
        height={GRID_SIZE.height * GRID_CELL_SIZE}
        className="p-4">
        <Layer>
          <Grid
            cellSize={GRID_CELL_SIZE}
            rows={GRID_SIZE.height}
            cols={GRID_SIZE.width}
            cellBorderColor="#35363A"
            cellFillColor="#1D1D20"
          />

          {tombstones.map(tombstone => (
            <Tombstone
              key={tombstone.id}
              id={tombstone.id}
              position={tombstone.position}
            />
          ))}

          <Exit id={0} position={EXIT_POSITION} />

          {ghosts.map(ghost => (
            <Ghost
              key={ghost.id}
              id={ghost.id}
              position={ghost.position}
              plan={ghost.plan}
              isFound={ghost.isFound}
            />
          ))}

          {players.map(player => (
            <Player
              key={player.id}
              id={player.id}
              position={player.position}
              plan={player.plan}
              isEscaping={player.isEscaping}
            />
          ))}
        </Layer>
      </Stage>
    </Wrapper>
  );
};
