import { drawCircle, drawSector } from '../../../core/utils/drawing';
import { renderGameOver } from './gameOver';

function renderTimers(): void {
  if (this.isGameOver) {
    return;
  }

  const ctx: CanvasRenderingContext2D = this.panelCanvas.getContext('2d');
  const blueTimeUsed: number = this.timer - this.players.blue.timer;
  const redTimeUsed: number = this.timer - this.players.red.timer;
  const timerStep: number = Math.PI * 2 / this.timer;

  const clearTimersRect = (): void => {
    ctx.clearRect(
      0,
      0,
      this.cellSize * 4,
      this.cellSize * 2 - this.cellSize / 2
    );
  };

  if (this.players.blue.timer === 0) {
    this.isGameOver = true;

    clearTimersRect();
    renderGameOver.call(this, 1);

    return;
  }

  clearTimersRect();

  // Blue timer
  drawCircle(
    ctx,
    this.cellSize,
    this.cellSize - this.cellSize / 4,
    this.cellSize / 2,
    {
      fillColor: 'rgb(0, 0, 255)',
    },
  );

  drawSector(
    ctx,
    this.cellSize,
    this.cellSize - this.cellSize / 4,
    this.cellSize / 2 + this.cellSize / 10,
    {
      fillColor: 'rgb(0, 0, 0)',
      startAngle: -Math.PI / 2,
      endAngle: timerStep * blueTimeUsed - Math.PI / 2,
    },
  );

  // Red timer
  if (!this.isComputerOn) {
    if (this.players.red.timer === 0) {
      this.isGameOver = true;

      clearTimersRect();
      renderGameOver.call(this, 2);

      return;
    }

    drawCircle(
      ctx,
      this.cellSize * 3,
      this.cellSize - this.cellSize / 4,
      this.cellSize / 2,
      {
        fillColor: 'rgb(255, 0, 0)',
      },
    );

    drawSector(
      ctx,
      this.cellSize * 3,
      this.cellSize - this.cellSize / 4,
      this.cellSize / 2 + this.cellSize / 10,
      {
        fillColor: 'rgb(0, 0, 0)',
        startAngle: -Math.PI / 2,
        endAngle: timerStep * redTimeUsed - Math.PI / 2,
      },
    );
  }
}

export { renderTimers };
