import { PageComponent } from '../core/Page';
import { Menu } from '../Menu';

import {
  CELL_SIZE_VMIN,
  DEFAULT_BOARD_SIZE,
  BEADS_COUNT,
  MAP_ITEM_TYPES,
  DIFFICULTY_EASY,
} from '../../constants/game';

import { renderGameWindow, renderGrid, renderMap, renderPanel } from './render';
import { getCellSize } from './helpers';
import { animateCursor } from './animations';
import { onBoardClick, onButtonClick } from './events';
import { aiMove } from './ai';

import { getStorageData } from '../../utils/storage';

import { Players } from './types';

class Game extends PageComponent {
  protected appRoot: HTMLElement;
  protected cellSize: number;
  protected boardSize: number;
  protected boardCanvas: HTMLCanvasElement;
  protected itemCanvas: HTMLCanvasElement;
  protected cursorCanvas: HTMLCanvasElement;
  protected panelCanvas: HTMLCanvasElement;
  protected newGameButton: HTMLButtonElement;
  protected backToMenuButton: HTMLButtonElement;
  protected boardMap: number[][];
  protected cursor: number[];
  protected players: Players;
  protected lockedCell: number[];
  protected difficultyLevel: number;
  protected idleMovesCounter: number;
  protected isComputerOn: boolean;
  protected isShowMovesOn: boolean;
  protected isGameOver: boolean;
  protected isMoving: boolean;

  public init(): void {
    const [
      storageBoardSize,
      storageFirstMove,
      storageDifficultyLevel,
      storageIsComputerOn,
      storageIsShowMovesOn,
    ]: [
      number | undefined,
      number | undefined,
      number | undefined,
      boolean | undefined,
      boolean | undefined,
    ] = getStorageData([
      'boardSize',
      'firstMove',
      'difficultyLevel',
      'isComputerOn',
      'isShowMovesOn',
    ]);

    this.appRoot = document.getElementById('root');
    this.appRoot.innerText = 'Loading...';

    this.cellSize = getCellSize(CELL_SIZE_VMIN);
    this.boardSize = storageBoardSize ?? DEFAULT_BOARD_SIZE;

    this.boardCanvas = document.createElement('canvas');
    this.itemCanvas = document.createElement('canvas');
    this.cursorCanvas = document.createElement('canvas');
    this.panelCanvas = document.createElement('canvas');

    this.newGameButton = document.createElement('button');
    this.backToMenuButton = document.createElement('button');

    this.images = {
      statueRed: {
        element: new Image(),
        src: './static/statue_red.svg',
      },
      statueBlue: {
        element: new Image(),
        src: './static/statue_blue.svg',
      },
      shield: {
        element: new Image(),
        src: './static/shield.svg',
      },
    };

    this.boardMap = [...new Array(this.boardSize)].map((itemY: number[], index: number): number[] => {
      const itemX: number[] = new Array(this.boardSize).fill(0);

      // Always place initially four red statues in the top left corner of the game board
      if (index === 0 || index === 1) {
        itemX[0] = itemX[1] = MAP_ITEM_TYPES.red.statue;
      }

      // Always place initially four blue statues in the bottom right corner of the game board
      if (index === this.boardSize - 2 || index === this.boardSize - 1) {
        itemX[this.boardSize - 2] = itemX[this.boardSize - 1] = MAP_ITEM_TYPES.blue.statue;
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
      {
        target: this.newGameButton,
        type: 'click',
        listener: onButtonClick.bind(this, Game.bind(null)),
      },
      {
        target: this.backToMenuButton,
        type: 'click',
        listener: onButtonClick.bind(this, Menu.bind(null)),
      },
    ];

    this.players = {
      red: {
        captured: 0,
        beads: BEADS_COUNT,
        active: storageFirstMove === 1,
        move: 0,
        lockedStatue: [],
      },
      blue: {
        captured: 0,
        beads: BEADS_COUNT,
        active: storageFirstMove === 2 || storageFirstMove === undefined,
        move: 0,
        lockedStatue: [],
      },
    };

    this.lockedCell = [];
    this.difficultyLevel = storageDifficultyLevel ?? DIFFICULTY_EASY;
    this.idleMovesCounter = 0;

    this.isComputerOn = storageIsComputerOn ?? true;
    this.isShowMovesOn = storageIsShowMovesOn ?? true;
    this.isGameOver = false;
    this.isMoving = false;
  }

  public async render(): Promise<void> {
    renderGameWindow.call(this);
    renderGrid.call(this);
    renderMap.call(this);
    renderPanel.call(this);

    animateCursor.call(this);

    if (this.isComputerOn === true && this.players.red.active === true) {
      await aiMove.call(this);
    }
  }
}

export { Game };
