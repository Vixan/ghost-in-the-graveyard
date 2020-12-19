import React, { FC, useEffect, useState } from "react";
import { Position } from "../types/position";
import { getRandomAgentPosition } from "../utils/agentUtils";
import { GridSize } from "../types/grid";
import { Agent } from "./Agent";

interface Props {
  initialPosition: Position;
  gridSize: GridSize;
  width: number;
  height: number;
}

export const Ghost: FC<Props> = ({
  initialPosition,
  gridSize,
  width,
  height
}: Props) => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  const wander = () => {
    const randomPosition = getRandomAgentPosition(initialPosition, gridSize);
    setPosition(randomPosition);
  };

  useEffect(() => {
    setPosition(initialPosition);
  }, []);

  return (
    <Agent
      x={position.x * width}
      y={position.y * height}
      width={width}
      height={height}
      color="#CC5A71"
      text="Ghost"
    />
  );
};
