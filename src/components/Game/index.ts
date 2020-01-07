import { CELL_SIZE_VMIN } from '../../constants/game';

import { renderGameWindow } from './render';
import { setCellSize } from './helpers';

import {
  onBoardClick,
  removeEventHandlers,
  setUpEventHandlers,
} from './events';

class Game {
  protected cellSize: number;
  protected boardCanvas: HTMLCanvasElement;
  protected piecesCanvas: HTMLCanvasElement;
  protected cursorCanvas: HTMLCanvasElement;
  protected boardMap: number[][];
  protected cursor: number[];
  protected eventHandlers: EventHandler[];

  constructor() {
    this.cellSize = setCellSize(CELL_SIZE_VMIN);

    this.boardCanvas = document.createElement('canvas');
    this.piecesCanvas = document.createElement('canvas');
    this.cursorCanvas = document.createElement('canvas');

    /**
     * Map legend:
     *  0 - Empty space
     *  1 - Red statue
     *  2 - Red bead
     *  3 - Blue statue
     *  4 - Blue bead
     */
    this.boardMap = [
      [1, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 3, 3],
      [0, 0, 0, 0, 0, 0, 3, 3],
    ];

    this.cursor = [];

    this.eventHandlers = [
      {
        target: this.cursorCanvas,
        type: 'click',
        listener: onBoardClick.bind(this),
      },
    ];

    this.render();
  }

  public render(): void {
    renderGameWindow.call(this);
    setUpEventHandlers.call(this);
  }

  public destroy(): void {
    removeEventHandlers.call(this);
  }
}

export { Game };
