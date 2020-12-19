import { Position } from "./position";

export interface GhostAgent {
  id: string;
  position: Position;
  isFound?: boolean;
}