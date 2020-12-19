import React, { FC, useEffect } from "react";
import { Layer, Stage } from "react-konva";
import { Grid } from "./components/Grid";
import { Ghost } from "./components/Ghost";
import { GridSize } from "./types/grid";
import styled from "styled-components";

const GRID_CELL_SIZE = 50;
const GRID_SIZE: GridSize = Object.freeze({ width: 10, height: 10 });

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  height: 100vh;
  background-color: #35363a;
`;

export const App: FC<{}> = () => {
  useEffect(() => {}, []);

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

          <Ghost
            width={GRID_CELL_SIZE}
            height={GRID_CELL_SIZE}
            gridSize={GRID_SIZE}
            initialPosition={{
              x: 0,
              y: 0
            }}
          />
        </Layer>
      </Stage>
    </Wrapper>
  );
};
