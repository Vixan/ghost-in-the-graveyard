import React, { FC, useState } from "react";
import styled from "styled-components";
import { Environment } from "./components/Environment";
import { GridSize } from "./components/Grid";
import { Switch } from "./components/ui/Switch";
import { Button } from "./components/ui/Button";
import { Position } from "./types/position";
import { SimulationStatus } from "./types/simulationStatus";
import { NumberInput } from "./components/ui/NumberInput";
import { RangeInput } from "./components/ui/RangeInput";

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
  margin: 32px 0;
  align-items: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    margin: 0;
  }
`;

const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 400px;
`;

const SettingsHeader = styled.div`
  color: #aaaaaa;
  text-align: center;

  @media (min-width: 1024px) {
    text-align: right;
  }
`;

const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;

  @media (min-width: 1024px) {
    align-items: flex-end;
  }
`;

const Title = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  color: #777777;
`;

const Description = styled.p`
  font-size: 0.75rem;
  color: #777777;
  font-style: italic;
`;

const Actions = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
`;

const Link = styled.a`
  color: #0a9dae;
`;

const GhostText = styled.span`
  color: #cc5a71;
  font-weight: bold;
`;

const PlayerText = styled.span`
  color: #0a9dae;
  font-weight: bold;
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
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [cycleCount, setCycleCount] = useState<number>(0);

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
            <Subtitle>
              Simulation by{" "}
              <Link href="https://github.com/Vixan">
                Duca Vitalie-Alexandru
              </Link>
            </Subtitle>

            <Description>
              <b>Description: </b>
              The <GhostText>Ghosts</GhostText> "wander" around the grid world.
              If a <PlayerText>Player</PlayerText> finds a Ghost, it stops and
              notifies all other Players that a Ghost has been found. The found
              Ghost starts moving towards the closest Player other than the one
              that found it in an attempt to "catch" it. If the Ghost catches a
              Player, the latter becomes the Ghost. All Players except the one
              that found the Ghost run to the Exit and disappear from the grid.
            </Description>
          </SettingsHeader>

          <SettingsContent>
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
            <RangeInput
              minValue={1}
              maxValue={3}
              step={1}
              value={simulationSpeed}
              label={"Simulation speed"}
              onChange={(value: number) => setSimulationSpeed(value)}
              disabled={!isSimulationNew}
            />
          </SettingsContent>

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
              color={isSimulationRunning ? "#aaaaaa" : "#000000"}
              text={
                isSimulationNew
                  ? "🚀 Start"
                  : isSimulationRunning
                  ? `⚡ Running (${cycleCount} cycles)`
                  : `⏸ Paused (${cycleCount} cycles)`
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
          simulationSpeed={simulationSpeed}
          incrementCycleCount={() => setCycleCount(cycleCount + 1)}
        />
      </ContentWrapper>
    </FullSizeWrapper>
  );
};
