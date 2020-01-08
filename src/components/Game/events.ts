import { APP } from '../../constants/game';

import { Game } from './';

import { clearCanvas, renderMove, renderPossibleMoves } from './render';
import { checkMoveToCell, checkPossibleMoves } from './actions';

/**
 * Helper function which creates all game's event listeners
 */
function setUpEventHandlers(): void {
  if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
    return;
  }

  for (const prop of this.eventHandlers) {
    const { target, type, listener } = prop;
    const element: HTMLElement = target instanceof Element || target instanceof HTMLDocument
      ? target as HTMLElement
      : document.getElementById(target as string);

    if (!element) {
      break;
    }

    element.addEventListener(type, listener);
  }
}

/**
 * Helper function which removes all game's event listeners
 */
function removeEventHandlers(): void {
  if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
    return;
  }

  for (const prop of this.eventHandlers) {
    const { target, type, listener } = prop;
    const element: HTMLElement = target instanceof Element || target instanceof HTMLDocument
      ? target as HTMLElement
      : document.getElementById(target as string);

    if (!element) {
      break;
    }

    element.removeEventListener(type, listener);
  }
}

/**
 * Function fires on the cursor canvas click event
 *
 * @param event
 */
function onBoardClick(event: MouseEvent): void {
  const actualCellSize: number = this.cursorCanvas.getBoundingClientRect().width / this.boardSize;
  const x: number = Math.trunc(event.offsetX / actualCellSize);
  const y: number = Math.trunc(event.offsetY / actualCellSize);
  const isRedTurn: boolean = this.players.red.active;
  const isBlueTurn: boolean = this.players.blue.active;

  if ((isRedTurn && this.boardMap[y][x] === 1) || (isBlueTurn && this.boardMap[y][x] === 3)) {
    clearCanvas.call(this, this.cursorCanvas);

    // Remove cursor if we click on an item which was already selected before
    this.cursor = Array.isArray(this.cursor) && this.cursor.length > 0 && this.cursor[1] === x && this.cursor[0] === y
      ? []
      : [y, x];

    if (this.cursor.length > 0) {
      renderPossibleMoves.call(this, checkPossibleMoves.call(this, x, y));
    }
  } else {
    if (this.cursor.length > 0) {
      if (checkMoveToCell.call(this, this.cursor[1], this.cursor[0], x, y)) {
        renderMove.call(this, this.cursor[1], this.cursor[0], x, y);
      }
    }
  }
}

/**
 * Function destroys current game and creates a new instance of the `Game` class
 */
function onNewGameButtonClick(): void {
  this.destroy();

  APP.pageInstance = new Game();
}

export {
  setUpEventHandlers,
  removeEventHandlers,
  onBoardClick,
  onNewGameButtonClick,
};
