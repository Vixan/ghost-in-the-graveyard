import { Position } from "./position";

export interface GhostBeliefs {
  id: string;
  position: Position;
  isFound?: boolean;
}