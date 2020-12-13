import React, { FC, useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { Agent } from "./components/Agent";
import { Grid } from "./components/Grid";

export const App: FC<{}> = () => {
  const [agentPosition, setAgentPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const randomAgentPositionInterval = setInterval(() => {
      const randomCell = {
        x: Math.floor(Math.random() * 12),
        y: Math.floor(Math.random() * 12)
      };

      setAgentPosition(randomCell);
    }, 500);

    return () => {
      clearInterval(randomAgentPositionInterval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-800">
      <Stage width={600} height={600} className="p-4 bg-gray-500 shadow-2xl">
        <Layer>
          <Grid cellSize={50} rows={12} cols={12} cellBorderColor="#cccccc" />

          <Agent
            x={agentPosition.x * 50}
            y={agentPosition.y * 50}
            width={50}
            height={50}
            color="#ff0000"
          />
        </Layer>
      </Stage>
    </div>
  );
};
