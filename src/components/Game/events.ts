import { Game } from '.';
import { Menu } from '../Menu';

import { MAP_ITEM_TYPES } from '../../constants/game';

import { renderMove, renderPossibleMoves } from './render';
import { checkMoveToCell, checkPossibleMoves } from './actions';
import { aiMove } from './ai';
import { clearCanvas } from './helpers';

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
        players: this.players,
        difficultyLevel: this.difficultyLevel,
      }, x, y));
    }
  } else {
    if (this.cursor.length > 0) {
      const checkMove: boolean = checkMoveToCell({
        boardMap: this.boardMap,
        lockedCell: this.lockedCell,
        players: this.players,
        difficultyLevel: this.difficultyLevel,
      }, this.cursor[1], this.cursor[0], x, y);

      if (checkMove) {
        renderMove.call(this, this.cursor[1], this.cursor[0], x, y).then(async () => {
          if (this.isComputerOn === true && !this.isGameOver) {
            await aiMove.call(this);
          }
        });
      }
    }
  }
}

function onButtonClick(component: typeof Game | typeof Menu): void {
  if (this.isMoving === true) {
    return;
  }

  this.destroy();

  new component();
}

export {
  onBoardClick,
  onButtonClick,
};
