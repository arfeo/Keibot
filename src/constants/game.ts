export const APP: {
  pageInstance: any;
  eventListeners: { [key: string]: EventListener };
} = {
  pageInstance: null,
  eventListeners: null,
};

export const STORAGE_PREFIX = 'keibot';

export const CELL_SIZE_VMIN = 10;
