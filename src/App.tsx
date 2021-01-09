import React, { FC, useState } from "react";
import styled from "styled-components";
import { Environment } from "./components/Environment";
import { GridSize } from "./components/Grid";
import { Switch } from "./components/ui/Switch";
import { Button } from "./components/ui/Button";
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
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    flex-direction: row;
    margin-bottom: 0;
  }
`;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;

  @media (min-width: 1024px) {
    align-items: flex-end;
  }
`;

const SettingsHeader = styled.div`
  color: #aaaaaa;
  text-align: center;
  margin: 16px 0;

  @media (min-width: 1024px) {
    text-align: right;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Subtitle = styled.span`
  font-size: 1rem;
  color: #777777;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
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
    SimulationStatus.New
  );
  const [displayAgentsViewArea, setDisplayAgentsViewArea] = useState<boolean>(
    false
  );
  const [tombstoneCount, setTombstoneCount] = useState<number>(
    MAX_TOMBSTONES_COUNT / 2
  );
  const [playerCount, setPlayerCount] = useState<number>(MAX_PLAYER_COUNT / 2);
  const [ghostCount, setGhostCount] = useState<number>(MAX_GHOST_COUNT / 2);
  const [resetCount, setResetCount] = useState<number>(0);

  const toggleSimulationRunningStatus = () => {
    if (simulationStatus === SimulationStatus.New) {
      setSimulationStatus(SimulationStatus.Running);
    } else if (simulationStatus === SimulationStatus.Running) {
      setSimulationStatus(SimulationStatus.Paused);
    } else if (simulationStatus === SimulationStatus.Paused) {
      setSimulationStatus(SimulationStatus.Running);
    }
  };

  const resetSimulation = () => {
    setSimulationStatus(SimulationStatus.New);
    setResetCount(resetCount + 1);
  };

  const isSimulationNew = simulationStatus === SimulationStatus.New;
  const isSimulationPaused = simulationStatus === SimulationStatus.Paused;
  const isSimulationRunning = simulationStatus === SimulationStatus.Running;

  return (
    <FullSizeWrapper>
      <ContentWrapper>
        <SettingsWrapper>
          <SettingsHeader>
            <Title>Ghost in the Graveyard</Title>
            <Subtitle>Simulation by Duca Vitalie-Alexandru</Subtitle>
          </SettingsHeader>

          <Switch
            selected={displayAgentsViewArea}
            onChange={() => setDisplayAgentsViewArea(!displayAgentsViewArea)}
            label="Display agents view area"
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
            disabled={!isSimulationNew}
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
            disabled={!isSimulationNew}
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
            disabled={!isSimulationNew}
          />

          <Actions>
            <Button
              onClick={toggleSimulationRunningStatus}
              backgroundColor={
                isSimulationNew
                  ? "#0dab76"
                  : isSimulationPaused
                  ? "#ffee88"
                  : "#1d1d20"
              }
              color={
                isSimulationRunning
                  ? "#aaaaaa"
                  : isSimulationPaused
                  ? "#0dab76"
                  : "#000000"
              }
              text={
                isSimulationNew
                  ? "🚀 Start"
                  : isSimulationRunning
                  ? "⚡ Running"
                  : "⏸ Paused"
              }
            />

            <Button
              onClick={resetSimulation}
              backgroundColor={"#1d1d20"}
              color={"#aaaaaa"}
              text={"🔁 Reset"}
            />
          </Actions>
        </SettingsWrapper>

        <Environment
          gridSize={GRID_SIZE}
          playerCount={playerCount}
          ghostCount={ghostCount}
          tombstoneCount={tombstoneCount}
          exitPosition={EXIT_POSITION}
          simulationStatus={simulationStatus}
          displayAgentsViewArea={displayAgentsViewArea}
          resetCount={resetCount}
        />
      </ContentWrapper>
    </FullSizeWrapper>
  );
};
