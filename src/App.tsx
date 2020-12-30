import React, { FC, useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import styled, { css } from "styled-components";
import { Exit } from "./components/agents/Exit";
import { useGhosts } from "./components/agents/Ghost";
import { usePlayers } from "./components/agents/Player";
import { useTombstones } from "./components/agents/Tombstone";
import { Grid, GRID_CELL_SIZE, GRID_SIZE } from "./components/Grid";
import { ToggleButton } from "./components/ui/ToggleButton";
import { Position } from "./types/position";

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
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }

  ${({ paused }: any) =>
    paused &&
    css`
      background-color: #ffee88;
      color: #000000;
    `}
`;

const ActionsPanel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  justify-content: space-between;
  width: 490px;
  color: #aaaaaa;
`;

const GHOST_COUNT = 2;
const PLAYER_COUNT = 3;
const TOMBSTONES_COUNT = 12;
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
  const { ghosts, renderGhosts, updateGhosts } = useGhosts(GHOST_COUNT);
  const { players, renderPlayers, updatePlayers } = usePlayers(PLAYER_COUNT);
  const { tombstones, renderedTombstones } = useTombstones(TOMBSTONES_COUNT);
  const [displayAgentViewArea, setDisplayAgentViewArea] = useState<boolean>(
    false
  );

  useEffect(() => {
    const getBinaryGrid = (): number[][] => {
      let grid = new Array(GRID_SIZE.width)
        .fill(0)
        .map(() => new Array(GRID_SIZE.height).fill(0));

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

    const reasoningLoop = setInterval(() => {
      const binaryGrid = getBinaryGrid();

      updateGhosts(binaryGrid, players);
      updatePlayers(binaryGrid, EXIT_POSITION);
    }, 500);

    return () => {
      clearInterval(reasoningLoop);
    };
  }, [
    ghosts,
    updateGhosts,
    players,
    updatePlayers,
    tombstones,
    simulationStatus
  ]);

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
        <PlayButton
          onClick={toggleSimulationStatus}
          paused={simulationStatus === SimulationStatus.Paused}>
          {simulationStatus === SimulationStatus.Running
            ? "⚡ Running"
            : "⏸ Paused"}
        </PlayButton>

        <div style={{ display: "flex", justifyItems: "center", gap: 16 }}>
          Display agent view area
          <ToggleButton
            selected={displayAgentViewArea}
            onChange={() => setDisplayAgentViewArea(!displayAgentViewArea)}
            selectedText="✔"
            deselectedText=""
          />
        </div>
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

          {renderGhosts(displayAgentViewArea)}

          {renderPlayers(displayAgentViewArea)}
        </Layer>
      </Stage>
    </Wrapper>
  );
};
