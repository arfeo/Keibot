import { ELEMENTS_COLORS } from '../../constants/game';

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
          edgingColor: ELEMENTS_COLORS.cursor[`border${state}`],
        },
      );
    }

    this.animateCursor = requestAnimationFrame(animate);
  };

  this.animateCursor = requestAnimationFrame(animate);
}

export { animateCursor };
