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

export interface BoardDescription {
  boardMap?: number[][];
  lockedCell?: number[];
  players?: Players;
  isGameOver?: boolean;
}

export interface BeadsPlacing {
  beadsCoordinates: number[][];
  boardDescription: BoardDescription;
}
