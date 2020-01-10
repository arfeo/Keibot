import { ELEMENT_PROPS, FADE_OUT_ANIMATION_SPEED } from '../../constants/game';

import { drawRectangle } from '../../utils/drawing';

/**
 * Function animates the cursor if current cursor position is not empty;
 * otherwise it draws nothing
 */
function animateCursor(): void {
  const ctx: CanvasRenderingContext2D = this.cursorCanvas.getContext('2d');
  let start: number = performance.now();
  let state = 1;
  const step = 150;

  const animate = (time: number): void => {
    if (Array.isArray(this.cursor) && this.cursor.length > 0) {
      const posX: number = this.cellSize * this.cursor[1];
      const posY: number = this.cellSize * this.cursor[0];

      if (time - start > step) {
        state = state < 4 ? state + 1 : 1;
        start = time;
      }

      drawRectangle(
        ctx,
        posX + this.cellSize / 40,
        posY + this.cellSize / 40,
        this.cellSize - this.cellSize / 20,
        this.cellSize - this.cellSize / 20,
        {
          edgingWidth: this.cellSize / 20,
          edgingColor: ELEMENT_PROPS.cursor[`border${state}`],
        },
      );
    }

    this.animateCursor = requestAnimationFrame(animate);
  };

  this.animateCursor = requestAnimationFrame(animate);
}

/**
 * Function animates an item fading in or out on the specified coordinates
 *
 * @param x
 * @param y
 */
function animateItemFade(x: number, y: number, fadeType: 'in' | 'out' = 'out'): Promise<void> {
  return new Promise((resolve) => {
    const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');
    const item: number | undefined = this.boardMap[y][x];
    let alpha = fadeType === 'out' ? 1 : 0;

    if (item !== 1 && item !== 3) {
      return resolve();
    }

    const animate = (): void => {
      if ((fadeType === 'out' && alpha < 0) || (fadeType === 'in' && alpha > 1)) {
        return resolve();
      }

      ctx.clearRect(
        this.cellSize * x,
        this.cellSize * y,
        this.cellSize,
        this.cellSize,
      );

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

export {
  animateCursor,
  animateItemFade,
};
