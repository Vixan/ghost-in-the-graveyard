import React, { FC, useEffect } from "react";
import { Layer, Stage } from "react-konva";
import styled from "styled-components";
import { useGhosts } from "./components/Ghost";
import { Grid } from "./components/Grid";
import { GRID_CELL_SIZE, GRID_SIZE } from "./types/grid";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  height: 100vh;
  background-color: #35363a;
`;

export const App: FC<{}> = () => {
  const [ghosts, wanderGhosts] = useGhosts({
    beliefs: [
      { id: "1", position: { x: 0, y: 0 } },
      { id: "2", position: { x: 4, y: 3 } }
    ]
  });

  useEffect(() => {
    const reasoningLoop = setInterval(() => {
      wanderGhosts();
    }, 1000);

    return () => {
      clearInterval(reasoningLoop);
    };
  }, []);

  return (
    <Wrapper>
      <Stage
        width={GRID_SIZE.width * GRID_CELL_SIZE}
        height={GRID_SIZE.height * GRID_CELL_SIZE}
        className="p-4">
        <Layer>
          <Grid
            cellSize={GRID_CELL_SIZE}
            rows={GRID_SIZE.height}
            cols={GRID_SIZE.width}
            cellBorderColor="#35363A"
            cellFillColor="#1D1D20"
          />

          {ghosts}
        </Layer>
      </Stage>
    </Wrapper>
  );
};
