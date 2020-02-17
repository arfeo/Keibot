export interface Player {
  captured: number;
  beads: number;
  active: boolean;
}

export interface BoardDescription {
  boardMap: number[][];
  lockedCell: number[];
}
