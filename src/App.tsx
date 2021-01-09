import React, { FC, useState } from "react";
import styled from "styled-components";
import { Environment } from "./components/Environment";
import { GridSize } from "./components/Grid";
import { AgentsViewAreaToggle } from "./components/ui/AgentsViewAreaToggle";
import { SimulationStatusButton } from "./components/ui/SimulationStatusButton";
import { Position } from "./types/position";
import { SimulationStatus } from "./types/simulationStatus";
import { NumberInput } from "./components/ui/NumberInput";

const FullSizeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  min-height: 100vh;
  background-color: #35363a;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;

  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 32px;
`;

const Title = styled.h1`
  color: #aaaaaa;
  text-align: right;
`;

const GRID_SIZE: GridSize = { width: 10, height: 10 };
const MIN_GHOST_COUNT = 1;
const MAX_GHOST_COUNT = 10;
const MIN_PLAYER_COUNT = 1;
const MAX_PLAYER_COUNT = 10;
const MIN_TOMBSTONES_COUNT = 0;
const MAX_TOMBSTONES_COUNT = 30;
const EXIT_POSITION: Position = {
  x: Math.floor(GRID_SIZE.width / 2) - 1,
  y: GRID_SIZE.height - 1
};

export const App: FC<{}> = () => {
  const [simulationStatus, setSimulationStatus] = useState(
    SimulationStatus.Paused
  );
  const [displayAgentsViewArea, setDisplayAgentsViewArea] = useState<boolean>(
    false
  );
  const [tombstoneCount, setTombstoneCount] = useState<number>(
    MAX_TOMBSTONES_COUNT / 2
  );
  const [playerCount, setPlayerCount] = useState<number>(MAX_PLAYER_COUNT / 2);
  const [ghostCount, setGhostCount] = useState<number>(MAX_GHOST_COUNT / 2);

  const toggleSimulationStatus = () => {
    if (simulationStatus === SimulationStatus.Running) {
      setSimulationStatus(SimulationStatus.Paused);
    } else if (simulationStatus === SimulationStatus.Paused) {
      setSimulationStatus(SimulationStatus.Running);
    }
  };

  return (
    <FullSizeWrapper>
      <ContentWrapper>
        <SettingsWrapper>
          <Title>
            Ghost in the Graveyard <br /> Simulation
          </Title>

          <AgentsViewAreaToggle
            selected={displayAgentsViewArea}
            onChange={() => setDisplayAgentsViewArea(!displayAgentsViewArea)}
          />
          <NumberInput
            minValue={MIN_PLAYER_COUNT}
            maxValue={MAX_PLAYER_COUNT}
            value={playerCount}
            label="Player count 🧍‍♂️"
            onClickDecrement={() =>
              setPlayerCount(Math.max(playerCount - 1, MIN_PLAYER_COUNT))
            }
            onClickIncrement={() =>
              setPlayerCount(Math.min(playerCount + 1, MAX_PLAYER_COUNT))
            }
            onChange={(value: number) => setPlayerCount(value)}
          />
          <NumberInput
            minValue={MIN_GHOST_COUNT}
            maxValue={MAX_GHOST_COUNT}
            value={ghostCount}
            label="Ghost count 👻"
            onClickDecrement={() =>
              setGhostCount(Math.max(ghostCount - 1, MIN_GHOST_COUNT))
            }
            onClickIncrement={() =>
              setGhostCount(Math.min(ghostCount + 1, MAX_GHOST_COUNT))
            }
            onChange={(value: number) => setGhostCount(value)}
          />
          <NumberInput
            minValue={MIN_TOMBSTONES_COUNT}
            maxValue={MAX_TOMBSTONES_COUNT}
            value={tombstoneCount}
            label="Tombstone count ⬛"
            onClickDecrement={() =>
              setTombstoneCount(
                Math.max(tombstoneCount - 1, MIN_TOMBSTONES_COUNT)
              )
            }
            onClickIncrement={() =>
              setTombstoneCount(
                Math.min(tombstoneCount + 1, MAX_TOMBSTONES_COUNT)
              )
            }
            onChange={(value: number) => setTombstoneCount(value)}
          />

          <SimulationStatusButton
            onClick={toggleSimulationStatus}
            paused={simulationStatus === SimulationStatus.Paused}
            text={
              simulationStatus === SimulationStatus.Running
                ? "⚡ Running"
                : "⏸ Paused"
            }
          />
        </SettingsWrapper>

        <Environment
          gridSize={GRID_SIZE}
          playerCount={playerCount}
          ghostCount={ghostCount}
          tombstoneCount={tombstoneCount}
          exitPosition={EXIT_POSITION}
          simulationStatus={simulationStatus}
          displayAgentsViewArea={displayAgentsViewArea}
        />
      </ContentWrapper>
    </FullSizeWrapper>
  );
};
