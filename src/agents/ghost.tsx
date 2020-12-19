import React, { useState } from "react";
import { Ghost } from "../components/Ghost";
import { GhostAgent } from "../types/ghostAgent";
import { getRandomAgentPosition } from "../utils/agentUtils";

interface Props {
  beliefs: GhostAgent[];
}

export const useGhosts = ({ beliefs }: Props) => {
  const [ghosts, setGhosts] = useState<GhostAgent[]>(beliefs);

  const renderedGhosts = (
    <>
      {ghosts.map(ghost => (
        <Ghost key={ghost.id} id={ghost.id} position={ghost.position} />
      ))}
    </>
  );

  const wanderGhosts = () => {
    const updatedGhosts = ghosts.map<GhostAgent>(ghost => ({
      ...ghost,
      position: getRandomAgentPosition(ghost.position)
    }));

    setGhosts(updatedGhosts);
  };

  return [renderedGhosts, wanderGhosts] as const;
};
