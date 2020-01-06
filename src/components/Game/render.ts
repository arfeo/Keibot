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

  drawTriangle(
    ctx,
    [left, top],
    [left + this.cellSize / 10, top],
    [left, top + this.cellSize / 10],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top],
    [left + this.cellSize - this.cellSize / 10, top],
    [left + this.cellSize, top + this.cellSize / 10],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left, top + this.cellSize],
    [left + this.cellSize / 10, top + this.cellSize],
    [left, top + this.cellSize - this.cellSize / 10],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top + this.cellSize],
    [left + this.cellSize - this.cellSize / 10, top + this.cellSize],
    [left + this.cellSize, top + this.cellSize - this.cellSize / 10],
    {
      fillColor: 'rgb(0, 0, 0)',
    },
  );
}

export {
  renderGameWindow,
};
