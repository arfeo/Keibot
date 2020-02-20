export interface Player {
  captured: number;
  beads: number;
  active: boolean;
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
  isGameOver?: boolean;
}

export type ApplyMoveResult = [number[][], GameState];
