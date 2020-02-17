import { Game } from '.';
import { Menu } from '../Menu';

import { APP, MAP_ITEM_TYPES } from '../../constants/game';

import { clearCanvas, renderMove, renderPossibleMoves } from './render';
import { checkMoveToCell, checkPossibleMoves } from './actions';
import { aiMove } from './ai';

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

  if (this.isMoving === true) {
    return;
  }

  if (
    (isRedTurn && this.boardMap[y][x] === MAP_ITEM_TYPES.red.statue && !this.isComputerOn)
    || (isBlueTurn && this.boardMap[y][x] === MAP_ITEM_TYPES.blue.statue)
  ) {
    clearCanvas.call(this, this.cursorCanvas);

    // Remove cursor if we click on an item which was already selected before
    this.cursor = Array.isArray(this.cursor) && this.cursor.length > 0 && this.cursor[1] === x && this.cursor[0] === y
      ? []
      : [y, x];

    if (this.cursor.length > 0 && this.isShowMovesOn) {
      renderPossibleMoves.call(this, checkPossibleMoves({
        boardMap: this.boardMap,
        lockedCell: this.lockedCell,
      }, x, y));
    }
  } else {
    if (this.cursor.length > 0) {
      const checkMove: boolean = checkMoveToCell({
        boardMap: this.boardMap,
        lockedCell: this.lockedCell,
      }, this.cursor[1], this.cursor[0], x, y);

      if (checkMove) {
        renderMove.call(this, this.cursor[1], this.cursor[0], x, y).then(async () => {
          // Computer plays if it's on
          if (this.isComputerOn === true) {
            await aiMove.call(this);
          }
        });
      }
    }
  }
}

/**
 * Function destroys current game and creates a new instance of the `Game` class
 */
function onButtonClick(Instance: typeof Game | typeof Menu): void {
  if (this.isMoving === true) {
    return;
  }

  this.destroy();

  APP.pageInstance = new Instance();
}

export {
  onBoardClick,
  onButtonClick,
};
