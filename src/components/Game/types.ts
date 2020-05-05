export interface Player {
  captured: number;
  beads: number;
  active: boolean;
  move: number;
  lockedStatue: number[];
  timer: number;
}

export interface Players {
  red: Player;
  blue: Player;
  [key: string]: Player;
}

export interface GameState {
  boardMap?: number[][];
  lockedCell?: number[];
  players?: Players;
  idleMovesCounter?: number;
  isGameOver?: boolean;
  difficultyLevel?: number;
}

export type ApplyMoveResult = [number[][], GameState];

export interface MapItemProps {
  statue: number;
  bead: number;
}

export interface DifficultyLevel {
  id: number;
  name: string;
  depth: number;
}
