import { CELL_SIZE_VMIN, DEFAULT_BOARD_SIZE } from '../../constants/game';

import { renderGameWindow, renderGrid, renderMap } from './render';
import { setCellSize, waitForImagesLoad } from './helpers';
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
  protected images: { [key: string]: { element: HTMLImageElement; src: string } };
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

    this.images = {
      statueRed: {
        element: new Image(),
        src: './static/statue_red.svg',
      },
      statueBlue: {
        element: new Image(),
        src: './static/statue_blue.svg',
      },
    };

    /**
     * Map legend:
     *  0 - Empty space
     *  1 - Red statue
     *  2 - Red bead
     *  3 - Blue statue
     *  4 - Blue bead
     */
    this.boardMap = [...new Array(this.boardSize)].map((itemY: number[], index: number): number[] => {
      const itemX: number[] = new Array(this.boardSize).fill(0);

      if (index === 0 || index === 1) {
        itemX[0] = itemX[1] = 1;
      }

      if (index === this.boardSize - 2 || index === this.boardSize - 1) {
        itemX[this.boardSize - 2] = itemX[this.boardSize - 1] = 3;
      }

      return itemX;
    });

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

    waitForImagesLoad(this.images).then(() => {
      this.render();
    });
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
