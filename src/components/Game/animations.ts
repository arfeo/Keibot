import { FADE_OUT_ANIMATION_SPEED, MAP_ITEM_TYPES } from '../../constants/game';

import { drawRectangle } from '../../core/utils/drawing';
import { renderTimers } from './render';
import { clearCanvas } from './helpers';

function animateCursor(): void {
  const ctx: CanvasRenderingContext2D = this.cursorCanvas.getContext('2d');
  let start: number = performance.now();
  let state = 1;
  const step = 150;

  const animate = (time: number): void => {
    if (this.isGameOver) {
      clearCanvas.call(this, this.cursorCanvas);

      return cancelAnimationFrame(this.animations.cursor);
    }

    if (Array.isArray(this.cursor) && this.cursor.length > 0 && !this.isGameOver) {
      const posX: number = this.cellSize * this.cursor[1];
      const posY: number = this.cellSize * this.cursor[0];

      if (time - start > step) {
        state = state < 4 ? state + 1 : 1;
        start = time;
      }

      const getBorderColor = (): string => {
        switch (state) {
          case 1: return 'rgba(70, 115, 190, 0.7)';
          case 2: return 'rgba(100, 145, 220, 0.7)';
          case 3: return 'rgba(145, 180, 250, 0.7)';
          case 4: return 'rgba(100, 145, 220, 0.7)';
          default: return '';
        }
      };

      drawRectangle(
        ctx,
        posX + this.cellSize / 40,
        posY + this.cellSize / 40,
        this.cellSize - this.cellSize / 20,
        this.cellSize - this.cellSize / 20,
        {
          edgingWidth: this.cellSize / 20,
          edgingColor: getBorderColor(),
        },
      );
    }

    this.animations.cursor = requestAnimationFrame(animate);
  };

  this.animations.cursor = requestAnimationFrame(animate);
}

function animateItemFade(x: number, y: number, fadeType: 'in' | 'out' = 'out'): Promise<void> {
  return new Promise((resolve) => {
    const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');
    const item: number | undefined = this.boardMap[y][x];
    let alpha = fadeType === 'out' ? 1 : 0;

    if (item !== MAP_ITEM_TYPES.red.statue && item !== MAP_ITEM_TYPES.blue.statue) {
      return resolve();
    }

    const clearCell = (): void => {
      ctx.clearRect(
        this.cellSize * x,
        this.cellSize * y,
        this.cellSize,
        this.cellSize,
      );
    };

    const animate = (): void => {
      if ((fadeType === 'out' && alpha < 0) || (fadeType === 'in' && alpha > 1)) {
        fadeType === 'out' && clearCell();

        return resolve();
      }

      clearCell();

      ctx.globalAlpha = alpha;

      ctx.drawImage(
        (item === 1 ? this.images.statueRed.element : this.images.statueBlue.element),
        this.cellSize * x + 5,
        this.cellSize * y + 5,
        this.cellSize - 10,
        this.cellSize - 10,
      );

      alpha += (fadeType === 'out' ? -1 : 1) * FADE_OUT_ANIMATION_SPEED / 4;

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  });
}

function animateTimers(): void {
  let start: number = performance.now();

  const animate = (time: number): void => {
    if (time - start > 1000 && !this.isMoving) {
      start = time;

      if (this.players.blue.active) {
        this.players.blue.timer -= 1;
      }

      if (this.players.red.active && !this.isComputerOn) {
        this.players.red.timer -= 1;
      }

      renderTimers.call(this);

      if (this.players.blue.timer === 0 || this.players.red.timer === 0) {
        return cancelAnimationFrame(this.animations.timers);
      }
    }

    this.animations.timers = requestAnimationFrame(animate);
  };

  this.animations.timers = requestAnimationFrame(animate);
}

export {
  animateCursor,
  animateItemFade,
  animateTimers,
};
