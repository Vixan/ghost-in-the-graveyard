import React, { FC, useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import styled, { css } from "styled-components";
import { Ghost, GhostBeliefs } from "./components/Ghost";
import { Grid, GRID_CELL_SIZE, GRID_SIZE } from "./components/Grid";
import { Player, PlayerBeliefs } from "./components/Player";
import {
  getRandomAgentPosition,
  getRandomInitialAgentPosition
} from "./utils/agentUtils";

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
const PLAYER_COUNT = 2;

enum SimulationStatus {
  Running,
  Paused,
  Ended
}

export const App: FC<{}> = () => {
  const [simulationStatus, setSimulationStatus] = useState(
    SimulationStatus.Running
  );
  const [ghosts, setGhosts] = useState<GhostBeliefs[]>([]);
  const [players, setPlayers] = useState<PlayerBeliefs[]>([]);

  useEffect(() => {
    const ghostsToCreate: GhostBeliefs[] = [...Array(GHOST_COUNT).keys()].map(
      i => ({
        id: i,
        position: getRandomInitialAgentPosition(),
        isFound: false,
        plan: "Wander"
      })
    );

    setGhosts(ghostsToCreate);

    const playersToCreate: PlayerBeliefs[] = [
      ...Array(PLAYER_COUNT).keys()
    ].map(i => ({
      id: i,
      position: getRandomInitialAgentPosition(),
      isFound: false,
      plan: "Wander"
    }));

    setPlayers(playersToCreate);
  }, []);

  useEffect(() => {
    const updateGhosts = () => {
      const ghostsToUpdate = ghosts.map(ghost => {
        if (ghost.plan === "Wander") {
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
        if (player.plan === "Wander") {
          return {
            ...player,
            position: getRandomAgentPosition(player.position)
          };
        }

        return player;
      });

      setPlayers(playersToUpdate);
    };

    if (simulationStatus !== SimulationStatus.Running) {
      return;
    }

    const reasoningLoop = setInterval(() => {
      updateGhosts();
      updatePlayers();
    }, 1000);

    return () => {
      clearInterval(reasoningLoop);
    };
  }, [ghosts, players, simulationStatus]);

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
              isFound={player.isFound}
            />
          ))}
        </Layer>
      </Stage>
    </Wrapper>
  );
};
