import React, { FC, useEffect } from "react";
import { Layer, Stage } from "react-konva";
import { Position } from "../types/position";
import { SimulationStatus } from "../types/simulationStatus";
import { createEmptyGrid } from "../utils/gridUtils";
import { Exit } from "./agents/Exit";
import { Ghost, useGhosts } from "./agents/Ghost";
import { Player, usePlayers } from "./agents/Player";
import { useTombstones } from "./agents/Tombstone";
import { Grid, GridSize, GRID_CELL_SIZE } from "./Grid";

interface Props {
  ghostCount: number;
  playerCount: number;
  tombstoneCount: number;
  exitPosition: Position;
  gridSize: GridSize;
  simulationStatus: SimulationStatus;
  displayAgentsViewArea: boolean;
  resetCount: number;
}

export const Environment: FC<Props> = ({
  ghostCount,
  playerCount,
  tombstoneCount,
  exitPosition,
  gridSize,
  simulationStatus,
  displayAgentsViewArea,
  resetCount
}) => {
  const binaryGrid = createEmptyGrid(gridSize.height, gridSize.width);

  const { tombstones, renderedTombstones } = useTombstones(
    binaryGrid,
    exitPosition,
    tombstoneCount,
    simulationStatus
  );
  const {
    ghosts,
    updateGhosts,
    setGhosts,
    getLatestGhosts,
    resetGhosts
  } = useGhosts(binaryGrid, exitPosition, ghostCount);
  const { players, updatePlayers, resetPlayers } = usePlayers(
    binaryGrid,
    exitPosition,
    playerCount
  );

  useEffect(
    () => {
      const getBinaryGrid = (): number[][] => {
        let grid = createEmptyGrid(gridSize.height, gridSize.width);

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
          exitPosition,
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

  useEffect(() => {
    resetGhosts();
    resetPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetCount]);

  return (
    <Stage
      scale={{ x: 1, y: 1 }}
      width={gridSize.width * GRID_CELL_SIZE}
      height={gridSize.height * GRID_CELL_SIZE}
      className="p-4">
      <Layer>
        <Grid
          cellSize={GRID_CELL_SIZE}
          rows={gridSize.height}
          cols={gridSize.width}
          cellBorderColor="#35363A"
          cellFillColor="#1D1D20"
        />

        <Exit id={0} position={exitPosition} />

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
  );
};
