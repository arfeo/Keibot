import { DifficultyLevel, MapItemProps } from '../components/Game/types';

export const DIFFICULTY_EASY = 1;
export const DIFFICULTY_NORMAL = 2;
export const DIFFICULTY_HARD = 3;

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    id: DIFFICULTY_EASY,
    name: 'Easy',
    depth: 1,
  },
  {
    id: DIFFICULTY_NORMAL,
    name: 'Normal',
    depth: 1,
  },
  {
    id: DIFFICULTY_HARD,
    name: 'Hard',
    depth: 3,
  },
];

export const STORAGE_NAME = 'keibot';
export const CELL_SIZE_VMIN = 10;
export const DEFAULT_BOARD_SIZE = 8;
export const BEADS_COUNT = 10;
export const FADE_OUT_ANIMATION_SPEED = 0.2;
export const IDLE_MOVES_LIMIT = 8;

export const MAP_ITEM_TYPES: { red: MapItemProps; blue: MapItemProps } = {
  red: {
    statue: 1,
    bead: 2,
  },
  blue: {
    statue: 3,
    bead: 4,
  },
};
