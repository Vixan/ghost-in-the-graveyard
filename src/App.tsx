import React, { FC, useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import styled from "styled-components";
import { Exit } from "./components/agents/Exit";
import { Ghost, useGhosts } from "./components/agents/Ghost";
import { Player, usePlayers } from "./components/agents/Player";
import { useTombstones } from "./components/agents/Tombstone";
import { Grid, GridSize, GRID_CELL_SIZE } from "./components/Grid";
import { AgentsViewAreaToggle } from "./components/ui/AgentsViewAreaToggle";
import { SimulationStatusButton } from "./components/ui/SimulationStatusButton";
import { Position } from "./types/position";
import { createEmptyGrid } from "./utils/gridUtils";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  height: 100vh;
  background-color: #35363a;
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  justify-content: space-between;
  width: 490px;
  color: #aaaaaa;
`;

const GRID_SIZE: GridSize = { width: 10, height: 10 };
const GHOST_COUNT = 3;
const PLAYER_COUNT = 6;
const TOMBSTONES_COUNT = 12;
const EXIT_POSITION: Position = {
  x: Math.floor(GRID_SIZE.width / 2) - 1,
  y: GRID_SIZE.height - 1
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
  const binaryGrid = createEmptyGrid(GRID_SIZE.height, GRID_SIZE.width);
  const { tombstones, renderedTombstones } = useTombstones(
    binaryGrid,
    EXIT_POSITION,
    TOMBSTONES_COUNT
  );
  const { ghosts, updateGhosts, setGhosts, getLatestGhosts } = useGhosts(
    binaryGrid,
    EXIT_POSITION,
    GHOST_COUNT
  );
  const { players, updatePlayers } = usePlayers(
    binaryGrid,
    EXIT_POSITION,
    PLAYER_COUNT
  );
  const [displayAgentsViewArea, setDisplayAgentsViewArea] = useState<boolean>(
    false
  );

  useEffect(
    () => {
      const getBinaryGrid = (): number[][] => {
        let grid = createEmptyGrid(GRID_SIZE.height, GRID_SIZE.width);

        ghosts.forEach(ghost => {
          grid[ghost.position.y][ghost.position.x] = 1;
        });
        players.forEach(player => {
          grid[player.position.y][player.position.x] = 1;
        });
        tombstones.forEach(tombstone => {
          grid[tombstone.position.y][tombstone.position.x] = 1;
        });

        return grid;
      };

      if (simulationStatus !== SimulationStatus.Running) {
        return;
      }

      const binaryGrid = getBinaryGrid();
      const reasoningLoopTimeout = setTimeout(async () => {
        updateGhosts(binaryGrid, players);
        updatePlayers(
          binaryGrid,
          EXIT_POSITION,
          await getLatestGhosts(),
          setGhosts
        );
      }, 800);

      return () => {
        clearTimeout(reasoningLoopTimeout);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ghosts, players, tombstones, simulationStatus]
  );

  const toggleSimulationStatus = () => {
    if (simulationStatus === SimulationStatus.Running) {
      setSimulationStatus(SimulationStatus.Paused);
    } else if (simulationStatus === SimulationStatus.Paused) {
      setSimulationStatus(SimulationStatus.Running);
    }
  };

  return (
    <Wrapper>
      <ActionsPanel>
        <SimulationStatusButton
          onClick={toggleSimulationStatus}
          paused={simulationStatus === SimulationStatus.Paused}
          text={
            simulationStatus === SimulationStatus.Running
              ? "⚡ Running"
              : "⏸ Paused"
          }
        />

        <AgentsViewAreaToggle
          selected={displayAgentsViewArea}
          onChange={() => setDisplayAgentsViewArea(!displayAgentsViewArea)}
        />
      </ActionsPanel>
      
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

          <Exit id={0} position={EXIT_POSITION} />

          {renderedTombstones}

          {ghosts.map(ghost => (
            <Ghost
              {...ghost}
              key={ghost.id}
              displayViewArea={displayAgentsViewArea}
            />
          ))}

          {players.map(player => (
            <Player
              key={player.id}
              id={player.id}
              position={player.position}
              desire={player.desire}
              isEscaping={player.isEscaping}
              isNotifyingGhostFound={player.isNotifyingGhostFound}
              isCaught={player.isCaught}
              displayViewArea={displayAgentsViewArea}
            />
          ))}
        </Layer>
      </Stage>
    </Wrapper>
  );
};
