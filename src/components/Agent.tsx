import React, { FC, useEffect, useState } from "react";
import { Group, Rect, Text } from "react-konva";
import { Position } from "../types/position";

interface Props {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
  viewRadius?: number;
}

export const Agent: FC<Props> = ({
  id,
  x,
  y,
  width,
  height,
  color,
  text,
  viewRadius = 0
}) => {
  const [isHovered, setHovered] = useState<boolean>(false);
  const [viewArea, setViewArea] = useState<Position[]>([]);

  useEffect(() => {
    const newViewArea = [...Array(viewRadius)]
      .map((_, i) => [
        { x: 0, y: -height * (i + 1) },
        { x: width * (i + 1), y: 0 },
        { x: 0, y: height * (i + 1) },
        { x: -width * (i + 1), y: 0 }
      ])
      .flat();

    setViewArea(newViewArea);
  }, [height, viewRadius, width]);

  return (
    <Group
      x={x}
      y={y}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {viewArea.map((areaFragment, i) => (
        <Rect
          key={i}
          x={areaFragment.x}
          y={areaFragment.y}
          height={height}
          width={width}
          strokeWidth={10}
          stroke="#35363A"
          fill={color}
          opacity={0.1}
          cornerRadius={10}
        />
      ))}
      <Rect
        width={width}
        height={height}
        fill={color}
        strokeWidth={10}
        stroke="#35363A"
        cornerRadius={10}
      />
      <Text
        text={isHovered ? `#${id}` : text}
        align="center"
        verticalAlign="middle"
        width={width}
        height={height}
        fill="#fff"
        fontSize={16}
      />
    </Group>
  );
};
