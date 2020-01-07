export const APP: {
  pageInstance: any;
} = {
  pageInstance: null,
};

export const STORAGE_PREFIX = 'keibot';

export const CELL_SIZE_VMIN = 10;

export const ELEMENTS_COLORS: HashMap = {
  cursor: {
    border1: 'rgba(70, 115, 190, 0.7)',
    border2: 'rgba(100, 145, 220, 0.7)',
    border3: 'rgba(145, 180, 250, 0.7)',
    border4: 'rgba(100, 145, 220, 0.7)',
  },
  item: {
    label: 'rgb(0, 0, 0)',
  },
  cell: {
    white: 'rgb(190, 190, 190)',
    black: 'rgb(95, 95, 95)',
  },
};
