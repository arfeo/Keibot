import { BEADS_COUNT, IDLE_MOVES_LIMIT, MAP_ITEM_TYPES } from '../../../constants/game';

import { drawCircle, drawImage, drawRectangle } from '../../../core/utils/drawing';
import { renderTimers } from './timers';
import { clearCanvas } from '../helpers';

function renderPanel(lastItemType?: number): void {
  const ctx: CanvasRenderingContext2D = this.panelCanvas.getContext('2d');

  clearCanvas.call(this, this.panelCanvas);

  if (this.timer > 0) {
    renderTimers.call(this);
  }

  if (this.isGameOver === true && lastItemType !== undefined) {
    ctx.font = '700 4vmin Helvetica, Arial';
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const message = this.idleMovesCounter === IDLE_MOVES_LIMIT ? 'Draw!' : this.isComputerOn
      ? (lastItemType === MAP_ITEM_TYPES.red.statue ? 'You lose!' : 'You win!')
      : (lastItemType === MAP_ITEM_TYPES.red.statue ? 'Red player wins!' : 'Blue player wins!');

    ctx.fillText(
      message,
      this.cellSize * 2,
      this.cellSize - this.cellSize / 4,
    );
  }

  drawRectangle(
    ctx,
    this.cellSize * 0.5 / 2,
    this.cellSize * 2,
    this.cellSize * 3.5,
    this.cellSize * 2,
    {
      edgingColor: 'rgb(255, 0, 0)',
      edgingWidth: this.players.red.active ? this.cellSize / 6 : this.cellSize / 30,
    },
  );

  drawRectangle(
    ctx,
    this.cellSize * 0.5 / 2,
    this.cellSize * 4.5,
    this.cellSize * 3.5,
    this.cellSize * 2,
    {
      edgingColor: 'rgb(0, 0, 255)',
      edgingWidth: this.players.blue.active ? this.cellSize / 6 : this.cellSize / 30,
    },
  );

  // Red statues captured by the blue player
  for (let x = 0; x < 3; x += 1) {
    if (x < this.players.blue.captured) {
      drawImage(
        ctx,
        this.images.statueRed,
        this.cellSize + this.cellSize / 1.5 * x,
        this.cellSize * 2.2,
        this.cellSize / 2,
        this.cellSize / 2,
      );
    }
  }

  // Red beads
  let redBeadsCounter = 0;

  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < BEADS_COUNT / 2; x += 1) {
      if (BEADS_COUNT - redBeadsCounter <= this.players.red.beads) {
        drawCircle(
          ctx,
          (this.cellSize * 0.5 / 2
            + this.cellSize / 2.5 * x
            + this.cellSize / 1.5
            + this.cellSize / 15 * x
            + this.cellSize / 10),
          this.cellSize * 3 + this.cellSize / 2.5 * y + this.cellSize / 15 * y + this.cellSize / 10,
          this.cellSize / 5,
          {
            fillColor: 'rgb(255, 0, 0)',
          },
        );
      }

      redBeadsCounter += 1;
    }
  }

  // Blue statues captured by the red player
  for (let x = 0; x < 3; x += 1) {
    if (x < this.players.red.captured) {
      drawImage(
        ctx,
        this.images.statueBlue,
        this.cellSize + this.cellSize / 1.5 * x,
        this.cellSize * 4.7,
        this.cellSize / 2,
        this.cellSize / 2,
      );
    }
  }

  // Blue beads
  let blueBeadsCounter = 0;

  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < BEADS_COUNT / 2; x += 1) {
      if (BEADS_COUNT - blueBeadsCounter <= this.players.blue.beads) {
        drawCircle(
          ctx,
          (this.cellSize * 0.5 / 2
            + this.cellSize / 2.5 * x
            + this.cellSize / 1.5
            + this.cellSize / 15 * x
            + this.cellSize / 10),
          this.cellSize * 5.4 + this.cellSize / 2.5 * y + this.cellSize / 15 * y + this.cellSize / 5,
          this.cellSize / 5,
          {
            fillColor: 'rgb(0, 0, 255)',
          },
        );
      }

      blueBeadsCounter += 1;
    }
  }
}

export { renderPanel };
