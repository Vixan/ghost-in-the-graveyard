import { FC } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

const CELL_SIZE = 50;
const CELL_BORDER_COLOR = "#ffffff";
const GHOST_COLOR = "#ff0000";

export const App: FC<{}> = () => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(600, 600).parent(canvasParentRef);
  };

  const drawGrid = (p5: p5Types) => {
    p5.noFill();
    p5.stroke(p5.color(CELL_BORDER_COLOR));

    for (var i = 0; i < p5.height + CELL_SIZE; i += CELL_SIZE) {
      for (var j = 0; j < p5.width + CELL_SIZE; j += CELL_SIZE) {
        p5.rect(i, j, CELL_SIZE, CELL_SIZE);
      }
    }
  };

  const drawGhost = (p5: p5Types) => {
    p5.fill(p5.color(GHOST_COLOR));
    p5.rect(CELL_SIZE, 0, CELL_SIZE, CELL_SIZE);
  };

  const draw = (p5: p5Types) => {
    drawGrid(p5);
    drawGhost(p5);
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-700">
      <div className="p-4 bg-gray-500 shadow-2xl">
        <Sketch setup={setup} draw={draw} />
      </div>
    </div>
  );
};
