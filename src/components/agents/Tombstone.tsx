import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import { getRandomAvailablePosition } from "../../utils/positionUtils";
import { GRID_CELL_SIZE } from "../Grid";
import { Agent } from "./Agent";
import { SimulationStatus } from "../../types/simulationStatus";

export interface TombstoneBeliefs {
  id: number;
  position: Position;
}

export const Tombstone: FC<TombstoneBeliefs> = ({ id, position }) => {
  return (
    <Agent
      id={id}
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#292A2D"
      text="⬛"
    />
  );
};

export const useTombstones = (
  binaryGrid: number[][],
  exitPosition: Position,
  tombstoneCount: number,
  simulationStatus: SimulationStatus
) => {
  const [tombstones, setTombstones] = useState<TombstoneBeliefs[]>([]);

  useEffect(() => {
    if (simulationStatus !== SimulationStatus.New) {
      return;
    }
    
    const tombstonesToCreate: TombstoneBeliefs[] = [
      ...Array(tombstoneCount).keys()
    ].map(i => {
      const randomPosition = getRandomAvailablePosition(
        binaryGrid,
        exitPosition
      );

      if (randomPosition) {
        binaryGrid[randomPosition.y][randomPosition.x] = 1;
      }

      return {
        id: i,
        position: randomPosition
      };
    });

    setTombstones(tombstonesToCreate.filter(t => t.position));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tombstoneCount, simulationStatus]);

  const renderedTombstones = tombstones.map(tombstone => (
    <Tombstone
      key={tombstone.id}
      id={tombstone.id}
      position={tombstone.position}
    />
  ));

  return { tombstones, setTombstones, renderedTombstones };
};
