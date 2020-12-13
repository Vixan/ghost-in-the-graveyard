import React, { FC } from "react";
import { Group, Rect, Text } from "react-konva";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export const Agent: FC<Props> = ({ x, y, width, height, color }) => {
  return (
    <Group x={x} y={y}>
      <Rect width={width} height={height} fill={color} />
      <Text
        text="Agent"
        align="center"
        verticalAlign="middle"
        width={width}
        height={height}
        fill="#fff"
      />
    </Group>
  );
};
