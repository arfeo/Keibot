export interface Player {
  captured: number;
  beads: number;
  active: boolean;
}

export interface Players {
  red: Player;
  blue: Player;
}

export interface BoardDescription {
  boardMap?: number[][];
  lockedCell?: number[];
  players?: Players;
  isGameOver?: boolean;
}

export interface BeadsPlacing {
  count: number;
  description: BoardDescription;
}
