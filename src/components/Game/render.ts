import { drawRectangle, drawTriangle } from '../../utils/drawing';

/**
 * Function creates game window element, game panel and all needed canvases
 */
function renderGameWindow(): void {
  const appRoot: HTMLElement = document.getElementById('root');
  const gameWindow: HTMLElement = document.createElement('div');
  const boardGrid: HTMLElement = document.createElement('div');
  const boardPanel: HTMLElement = document.createElement('div');
  const canvasSize: number = this.cellSize * 8;

  this.boardCanvas = document.createElement('canvas');
  this.piecesCanvas = document.createElement('canvas');

  gameWindow.className = 'gameWindow';
  boardGrid.className = 'boardGrid';
  boardPanel.className = 'boardPanel';
  this.boardCanvas.className = '-board-canvas';
  this.piecesCanvas.className = '-pieces-canvas';

  this.boardCanvas.width = canvasSize;
  this.boardCanvas.height = canvasSize;
  this.piecesCanvas.width = canvasSize;
  this.piecesCanvas.height = canvasSize;

  appRoot.innerHTML = '';

  appRoot.appendChild(gameWindow);
  gameWindow.appendChild(boardGrid);
  boardGrid.appendChild(this.boardCanvas);
  boardGrid.appendChild(this.piecesCanvas);
  gameWindow.appendChild(boardPanel);

  renderGrid.call(this);
}

/**
 * Function renders game board 8x8 chess type grid
 */
function renderGrid(): void {
  const ctx: CanvasRenderingContext2D = this.boardCanvas.getContext('2d');

  ctx.clearRect(0, 0, this.cellSize * 8, this.cellSize * 8);

  // The grid
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      renderGridCell.call(this, x, y);
    }
  }
}

/**
 * Function renders a single grid cell
 *
 * @param x
 * @param y
 */
function renderGridCell(x: number, y: number): void {
  const ctx: CanvasRenderingContext2D = this.boardCanvas.getContext('2d');
  const left: number = this.cellSize * x;
  const top: number = this.cellSize * y;
  const cellCornerSize = 10;

  drawRectangle(
    ctx,
    left,
    top,
    this.cellSize,
    this.cellSize,
    {
      fillColor: 'rgb(200, 200, 200)',
      edgingColor: 'rgb(0, 0, 0)',
      edgingWidth: 2,
    },
  );

  // Random background noise
  const hmTimes = Math.round(this.cellSize * 2);

  for (let i = 0; i <= hmTimes; i += 1) {
    const randomX = Math.floor((Math.random() * this.cellSize) + 1);
    const randomY = Math.floor((Math.random() * this.cellSize) + 1);
    const randomSize = Math.floor((Math.random() * 1.3) + 1);
    const randomOpacityOne = Math.floor((Math.random() * 9) + 1);
    const randomOpacityTwo = Math.floor((Math.random() * 9) + 1);

    if (randomSize > 1) {
      ctx.shadowBlur = Math.floor((Math.random() * 15) + 5);
      ctx.shadowColor = 'rgb(0, 0, 0)';
    }

    ctx.fillStyle = `hsla(0, 0%, 0%, .${randomOpacityOne + randomOpacityTwo})`;

    ctx.fillRect(
      randomX + this.cellSize * x,
      randomY + this.cellSize * y,
      randomSize,
      randomSize,
    );
  }

  drawTriangle(
    ctx,
    [left, top],
    [left + this.cellSize / cellCornerSize, top],
    [left, top + this.cellSize / cellCornerSize],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top],
    [left + this.cellSize - this.cellSize / cellCornerSize, top],
    [left + this.cellSize, top + this.cellSize / cellCornerSize],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left, top + this.cellSize],
    [left + this.cellSize / cellCornerSize, top + this.cellSize],
    [left, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top + this.cellSize],
    [left + this.cellSize - this.cellSize / cellCornerSize, top + this.cellSize],
    [left + this.cellSize, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );
}

export {
  renderGameWindow,
};
