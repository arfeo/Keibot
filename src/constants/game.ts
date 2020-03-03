export const APP: App = {
  pageInstance: null,
};

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

export const STORAGE_PREFIX = 'keibot';

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

export const ELEMENT_PROPS: HashMap = {
  cell: {
    background: 'rgb(192, 192, 192)',
    border: 'rgb(0, 0, 0)',
    shadow: 'rgb(0, 0, 0)',
  },
  cursor: {
    border1: 'rgba(70, 115, 190, 0.7)',
    border2: 'rgba(100, 145, 220, 0.7)',
    border3: 'rgba(145, 180, 250, 0.7)',
    border4: 'rgba(100, 145, 220, 0.7)',
  },
  move: {
    background: 'rgb(0, 165, 0)',
    border: 'rgb(255, 255, 255)',
  },
  bead: {
    red: 'rgb(255, 0, 0)',
    blue: 'rgb(0, 0, 255)',
  },
  panel: {
    red: 'rgb(255, 0, 0)',
    blue: 'rgb(0, 0, 255)',
  },
  gameOver: {
    font: '700 4vmin Helvetica, Arial',
    color: 'rgb(255, 255, 255)',
    align: 'center',
    baseline: 'middle',
  },
};
