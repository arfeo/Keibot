import { ELEMENTS_COLORS } from '../../constants/game';

import { drawCircle, drawRectangle, drawTriangle } from '../../utils/drawing';

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
  clearCanvas.call(this, this.boardCanvas);

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
      ctx.shadowBlur = 10;
      ctx.shadowColor = ELEMENTS_COLORS.cell.shadow;
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
  if (!this.boardMap[y]) {
    return;
  }

  const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');
  const item: number | undefined = this.boardMap[y][x];

  ctx.clearRect(
    this.cellSize * x,
    this.cellSize * y,
    this.cellSize,
    this.cellSize,
  );

  if (!item) {
    return;
  }

  // Statues
  if (item === 1 || item === 3) {
    ctx.drawImage(
      (item === 1 ? this.images.statueRed.element : this.images.statueBlue.element),
      this.cellSize * x + 5,
      this.cellSize * y + 5,
      this.cellSize - 10,
      this.cellSize - 10,
    );
  }

  // Beads
  if (item === 2 || item === 4) {
    const posX: number = this.cellSize * x + this.cellSize / 2;
    const posY: number = this.cellSize * y + this.cellSize / 2;

    drawCircle(
      ctx,
      posX,
      posY,
      20,
      {
        fillColor: item === 2 ? ELEMENTS_COLORS.bead.red : ELEMENTS_COLORS.bead.blue,
      },
    );
  }
}

/**
 * ...
 *
 * @param moves
 */
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
      10,
      {
        fillColor: ELEMENTS_COLORS.move.background,
        edgingColor: ELEMENTS_COLORS.move.border,
        edgingWidth: 4,
      },
    );
  });
}

/**
 * Function renders the movement of a statue from its original position to a cell
 * with the given coordinates
 *
 * @param itemX
 * @param itemY
 * @param cellX
 * @param cellY
 */
function renderMove(itemX: number, itemY: number, cellX: number, cellY: number): void {
  const itemType: number = this.boardMap[itemY][itemX];

  this.boardMap[itemY][itemX] = 0;
  this.boardMap[cellY][cellX] = itemType;

  this.cursor = [];

  clearCanvas.call(this, this.cursorCanvas);

  renderMap.call(this);
}

/**
 * Function clears the canvas given by the corresponding HTML element
 *
 * @param canvas
 */
function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

  ctx.clearRect(
    0,
    0,
    this.cellSize * this.boardSize,
    this.cellSize * this.boardSize,
  );
}

export {
  renderGameWindow,
  renderGrid,
  renderMap,
  renderPossibleMoves,
  renderMove,
  clearCanvas,
};
