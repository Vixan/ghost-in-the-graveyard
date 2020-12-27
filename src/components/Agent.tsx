import React, { FC, useState } from "react";
import { Group, Rect, Text } from "react-konva";

interface Props {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
}

export const Agent: FC<Props> = ({ id, x, y, width, height, color, text }) => {
  const [isHovered, setHovered] = useState<boolean>(false);

  return (
    <Group
      x={x}
      y={y}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
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
