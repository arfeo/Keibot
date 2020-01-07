import { CELL_SIZE_VMIN, DEFAULT_BOARD_SIZE } from '../../constants/game';

import { renderGameWindow, renderGrid, renderMap } from './render';
import { setCellSize } from './helpers';
import { animateCursor } from './animations';

import {
  onBoardClick,
  removeEventHandlers,
  setUpEventHandlers,
} from './events';

import { Player } from '../../typings/game';

class Game {
  protected cellSize: number;
  protected boardSize: number;
  protected boardCanvas: HTMLCanvasElement;
  protected itemCanvas: HTMLCanvasElement;
  protected cursorCanvas: HTMLCanvasElement;
  protected boardMap: number[][];
  protected cursor: number[];
  protected eventHandlers: EventHandler[];
  protected players: { [key: string]: Player };

  public constructor() {
    this.cellSize = setCellSize(CELL_SIZE_VMIN);

    this.boardSize = DEFAULT_BOARD_SIZE;

    this.boardCanvas = document.createElement('canvas');
    this.itemCanvas = document.createElement('canvas');
    this.cursorCanvas = document.createElement('canvas');

    /**
     * Map legend:
     *  0 - Empty space
     *  1 - Red statue
     *  2 - Red bead
     *  3 - Blue statue
     *  4 - Blue bead
     */
    // TODO: Generate the map automatically depending on the given `boardSize`
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

    this.players = {
      red: {
        captured: 0,
        beads: 10,
      },
      blue: {
        captured: 0,
        beads: 10,
      },
    };

    this.render();
  }

  public render(): void {
    renderGameWindow.call(this);
    renderGrid.call(this);
    renderMap.call(this);
    animateCursor.call(this);
    setUpEventHandlers.call(this);
  }

  public destroy(): void {
    removeEventHandlers.call(this);
  }
}

export { Game };
