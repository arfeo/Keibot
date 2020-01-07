import { ELEMENTS_COLORS, ITEM_LABEL_FONT } from '../../constants/game';

import { drawRectangle, drawTriangle } from '../../utils/drawing';

/**
 * Function creates all needed game window elements
 */
function renderGameWindow(): void {
  const appRoot: HTMLElement = document.getElementById('root');
  const gameWindow: HTMLElement = document.createElement('div');
  const boardGrid: HTMLElement = document.createElement('div');
  const boardPanel: HTMLElement = document.createElement('div');
  const canvasSize: number = this.cellSize * this.boardSize;

  gameWindow.className = 'gameWindow';
  boardGrid.className = 'boardGrid';
  boardPanel.className = 'boardPanel';
  this.boardCanvas.className = '-board-canvas';
  this.itemCanvas.className = '-item-canvas';
  this.cursorCanvas.className = '-cursor-canvas';

  this.boardCanvas.width = this.itemCanvas.width = this.cursorCanvas.width = canvasSize;
  this.boardCanvas.height = this.itemCanvas.height = this.cursorCanvas.height = canvasSize;

  appRoot.innerHTML = '';

  appRoot.appendChild(gameWindow);
  gameWindow.appendChild(boardGrid);
  boardGrid.appendChild(this.boardCanvas);
  boardGrid.appendChild(this.itemCanvas);
  boardGrid.appendChild(this.cursorCanvas);
  gameWindow.appendChild(boardPanel);
}

/**
 * Function renders game board grid according to the `boardSize` prop
 */
function renderGrid(): void {
  const ctx: CanvasRenderingContext2D = this.boardCanvas.getContext('2d');

  ctx.clearRect(
    0,
    0,
    this.cellSize * this.boardSize,
    this.cellSize * this.boardSize,
  );

  // The grid
  for (let y = 0; y < this.boardSize; y += 1) {
    for (let x = 0; x < this.boardSize; x += 1) {
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
      fillColor: ELEMENTS_COLORS.cell.background,
      edgingColor: ELEMENTS_COLORS.cell.border,
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
      fillColor: ELEMENTS_COLORS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top],
    [left + this.cellSize - this.cellSize / cellCornerSize, top],
    [left + this.cellSize, top + this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENTS_COLORS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left, top + this.cellSize],
    [left + this.cellSize / cellCornerSize, top + this.cellSize],
    [left, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENTS_COLORS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top + this.cellSize],
    [left + this.cellSize - this.cellSize / cellCornerSize, top + this.cellSize],
    [left + this.cellSize, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENTS_COLORS.cell.border,
    },
  );
}

/**
 * Function renders players' statues and beads according to the `boardMap` prop
 */
function renderMap(): void {
  if (!Array.isArray(this.boardMap) || this.boardMap.length === 0) {
    return;
  }

  for (let y = 0; y < this.boardMap.length; y += 1) {
    for (let x = 0; x < this.boardMap[y].length; x += 1) {
      renderMapItem.call(this, x, y);
    }
  }
}

/**
 * Function renders a single game board map item found by its position
 *
 * @param x
 * @param y
 */
function renderMapItem(x: number, y: number): void {
  const item: number = this.boardMap[y][x];

  if (!item) {
    return;
  }

  const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');
  const posX: number = this.cellSize * x + this.cellSize / 2;
  const posY: number = this.cellSize * y + this.cellSize / 2;

  ctx.font = ITEM_LABEL_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = item === 1 || item === 2 ? 'red' : 'blue';

  ctx.fillText(item === 1 || item === 3 ? '♞': '⚈', posX, posY);
}

export {
  renderGameWindow,
  renderGrid,
  renderMap,
};
