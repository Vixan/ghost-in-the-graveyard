import React, { FC, useState } from "react";
import { GhostBeliefs } from "../types/ghostBeliefs";
import { GRID_CELL_SIZE } from "../types/grid";
import { getRandomAgentPosition } from "../utils/agentUtils";
import { Agent } from "./Agent";

export const useGhosts = ({ beliefs }: { beliefs: GhostBeliefs[] }) => {
  const [ghosts, setGhosts] = useState<GhostBeliefs[]>(beliefs);

  const renderedGhosts = (
    <>
      {ghosts.map(ghost => (
        <Ghost key={ghost.id} id={ghost.id} position={ghost.position} />
      ))}
    </>
  );

  const wanderGhosts = () => {
    const updatedGhosts = ghosts.map<GhostBeliefs>(ghost => ({
      ...ghost,
      position: getRandomAgentPosition(ghost.position)
    }));

    setGhosts(updatedGhosts);
  };

  return [renderedGhosts, wanderGhosts] as const;
};

interface Props extends GhostBeliefs {}

export const Ghost: FC<Props> = ({ id, position }) => {
  return (
    <Agent
      x={position.x * GRID_CELL_SIZE}
      y={position.y * GRID_CELL_SIZE}
      width={GRID_CELL_SIZE}
      height={GRID_CELL_SIZE}
      color="#CC5A71"
      text={`Ghost ${id}`}
    />
  );
};
