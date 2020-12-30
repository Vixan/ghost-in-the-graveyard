import React, { FC, useEffect, useState } from "react";
import { Position } from "../../types/position";
import { Agent } from "./Agent";
import { GRID_CELL_SIZE } from "../Grid";
import { getRandomAvailablePosition } from "../../utils/agentUtils";

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

export const useTombstones = (tombstoneCount: number) => {
  const [tombstones, setTombstones] = useState<TombstoneBeliefs[]>([]);

  useEffect(() => {
    const tombstonesToCreate: TombstoneBeliefs[] = [
      ...Array(tombstoneCount).keys()
    ].map(i => ({
      id: i,
      position: getRandomAvailablePosition()
    }));

    setTombstones(tombstonesToCreate);
  }, [tombstoneCount]);

  const renderedTombstones = tombstones.map(tombstone => (
    <Tombstone
      key={tombstone.id}
      id={tombstone.id}
      position={tombstone.position}
    />
  ));

  return { tombstones, setTombstones, renderedTombstones };
};
