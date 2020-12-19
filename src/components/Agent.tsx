import React, { FC } from "react";
import { Group, Rect, Text } from "react-konva";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text: string;
}

export const Agent: FC<Props> = ({ x, y, width, height, color, text }) => {
  return (
    <Group x={x} y={y}>
      <Rect
        width={width}
        height={height}
        fill={color}
        strokeWidth={10}
        stroke="#35363A"
        cornerRadius={10}
      />
      <Text
        text={text}
        align="center"
        verticalAlign="middle"
        width={width}
        height={height}
        fill="#fff"
        fontSize={8}
      />
    </Group>
  );
};
