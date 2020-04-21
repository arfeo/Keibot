import { PageComponent } from '../../core/components';
import { Menu } from '../Menu';

import {
  CELL_SIZE_VMIN,
  DEFAULT_BOARD_SIZE,
  BEADS_COUNT,
  MAP_ITEM_TYPES,
  DIFFICULTY_EASY,
  STORAGE_NAME,
} from '../../constants/game';

import { renderGameWindow } from './render';
import { animateCursor, animateTimers } from './animations';
import { onBoardClick, onButtonClick } from './events';
import { aiMove } from './ai';
import { getCellSize } from '../../core/utils/game';

import { getStorageData } from '../../core/utils/storage';

import { Players } from './types';
import { ImageProps } from '../../core/components/types';

class Game extends PageComponent {
  private cellSize: number;
  private boardSize: number;
  private boardCanvas: HTMLCanvasElement;
  private itemCanvas: HTMLCanvasElement;
  private cursorCanvas: HTMLCanvasElement;
  private panelCanvas: HTMLCanvasElement;
  private newGameButton: HTMLButtonElement;
  private backToMenuButton: HTMLButtonElement;
  private boardMap: number[][];
  private cursor: number[];
  private players: Players;
  private lockedCell: number[];
  private difficultyLevel: number;
  private idleMovesCounter: number;
  private isComputerOn: boolean;
  private isShowMovesOn: boolean;
  private timer: number;
  private isGameOver: boolean;
  private isMoving: boolean;

  public images: {
    statueRed: ImageProps;
    statueBlue: ImageProps;
    shield: ImageProps;
  }

  public animations: {
    cursor: number;
    timers: number;
  };

  public init(): void {
    const [
      storageBoardSize,
      storageFirstMove,
      storageDifficultyLevel,
      storageIsComputerOn,
      storageIsShowMovesOn,
      storageTimer,
    ] = getStorageData(STORAGE_NAME, [
      'boardSize',
      'firstMove',
      'difficultyLevel',
      'isComputerOn',
      'isShowMovesOn',
      'timer',
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
        src: './static/statue_red.svg',
      },
      statueBlue: {
        src: './static/statue_blue.svg',
      },
      shield: {
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

    this.lockedCell = [];
    this.difficultyLevel = storageDifficultyLevel ?? DIFFICULTY_EASY;
    this.idleMovesCounter = 0;

    this.isComputerOn = storageIsComputerOn ?? true;
    this.isShowMovesOn = storageIsShowMovesOn ?? true;
    this.timer = (storageTimer ?? 0) * 60;
    this.isGameOver = false;
    this.isMoving = false;

    this.players = {
      red: {
        captured: 0,
        beads: BEADS_COUNT,
        active: storageFirstMove === 1,
        move: 0,
        lockedStatue: [],
        timer: this.timer,
      },
      blue: {
        captured: 0,
        beads: BEADS_COUNT,
        active: storageFirstMove === 2 || storageFirstMove === undefined,
        move: 0,
        lockedStatue: [],
        timer: this.timer,
      },
    };

    this.animations = {
      cursor: null,
      timers: null,
    };
  }

  public afterMount(): void {
    animateCursor.call(this);

    if (this.timer > 0) {
      animateTimers.call(this);
    }

    if (this.isComputerOn === true && this.players.red.active === true) {
      aiMove.call(this);
    }
  }

  public render(): HTMLElement {
    return renderGameWindow.call(this);
  }
}

export { Game };
