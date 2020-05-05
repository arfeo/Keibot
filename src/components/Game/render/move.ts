import { MAP_ITEM_TYPES } from '../../../constants/game';

import { drawCircle, drawImage } from '../../../core/utils/drawing';
import { renderMapItem } from './map';
import { renderGameOver } from './gameOver';
import { renderPanel } from './panel';
import { animateItemFade } from '../animations';
import { applyMove } from '../actions';
import { clearCanvas } from '../helpers';

import { ApplyMoveResult } from '../types';

async function renderMove(itemX: number, itemY: number, cellX: number, cellY: number): Promise<void> {
  const itemType: number = this.boardMap[itemY] ? this.boardMap[itemY][itemX] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  this.isMoving = true;
  this.cursor = [];

  clearCanvas.call(this, this.cursorCanvas);

  await animateItemFade.call(this, itemX, itemY, 'out');

  const moveResult: ApplyMoveResult = applyMove({
    boardMap: this.boardMap,
    lockedCell: this.lockedCell,
    players: this.players,
    idleMovesCounter: this.idleMovesCounter,
    isGameOver: this.isGameOver,
    difficultyLevel: this.difficultyLevel,
  }, itemX, itemY, cellX, cellY, this.difficultyLevel);

  const [beadsCoordinates, gameState]: ApplyMoveResult = moveResult;

  this.boardMap = gameState.boardMap;
  this.players = gameState.players;
  this.idleMovesCounter = gameState.idleMovesCounter;
  this.isGameOver = gameState.isGameOver;

  await animateItemFade.call(this, cellX, cellY, 'in');

  // Redraw previously locked statue, removing the shield icon from it
  if (this.lockedCell.length > 0) {
    renderMapItem.call(this, this.lockedCell[1], this.lockedCell[0]);
  }

  this.lockedCell = gameState.lockedCell;

  // Since we move a statue, it should be locked without any doubt
  renderShield.call(this);

  // Render new beads on the game board (if any)
  for (const bead of beadsCoordinates) {
    renderMapItem.call(this, bead[1], bead[0]);
  }

  this.isMoving = false;

  if (!this.isGameOver) {
    renderPanel.call(this);
  } else {
    renderGameOver.call(this, itemType);
  }

  return Promise.resolve();
}

function renderShield(): void {
  const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');

  drawImage(
    ctx,
    this.images.shield,
    this.cellSize * this.lockedCell[1] + this.cellSize / 3,
    this.cellSize * this.lockedCell[0] + this.cellSize / 2,
    this.cellSize / 3,
    this.cellSize / 3,
  );
}

function renderPossibleMoves(moves: number[][]): void {
  if (!Array.isArray(moves) || moves.length === 0) {
    return;
  }

  const ctx: CanvasRenderingContext2D = this.cursorCanvas.getContext('2d');

  moves.forEach((move: number[]) => {
    const posX: number = this.cellSize * move[1] + this.cellSize / 2;
    const posY: number = this.cellSize * move[0] + this.cellSize / 2;

    drawCircle(
      ctx,
      posX,
      posY,
      this.cellSize / 8,
      {
        fillColor: 'rgb(0, 165, 0)',
        edgingColor: 'rgb(255, 255, 255)',
        edgingWidth: this.cellSize / 20,
      },
    );
  });
}

export {
  renderMove,
  renderPossibleMoves,
};
