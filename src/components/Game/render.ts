import { BEADS_COUNT, ELEMENT_PROPS } from '../../constants/game';

import { drawCircle, drawRectangle, drawTriangle } from '../../utils/drawing';
import { checkBeadsPlacing, processGameOver } from './actions';

/**
 * Function creates all needed game window elements
 */
function renderGameWindow(): void {
  const gameWindow: HTMLElement = document.createElement('div');
  const boardGrid: HTMLElement = document.createElement('div');
  const boardPanel: HTMLElement = document.createElement('div');
  const panelButtons: HTMLElement = document.createElement('div');
  const canvasSize: number = this.cellSize * this.boardSize;

  gameWindow.className = 'gameWindow';
  boardGrid.className = 'boardGrid';
  boardPanel.className = 'boardPanel';
  this.boardCanvas.className = '-board-canvas';
  this.itemCanvas.className = '-item-canvas';
  this.cursorCanvas.className = '-cursor-canvas';
  this.panelCanvas.className = '-panel-canvas';
  panelButtons.className = '-panel-buttons';
  this.newGameButton.className = '-button';
  this.backToMenuButton.className = '-button';

  this.boardCanvas.width = this.itemCanvas.width = this.cursorCanvas.width = canvasSize;
  this.boardCanvas.height = this.itemCanvas.height = this.cursorCanvas.height = canvasSize;
  this.panelCanvas.width = this.cellSize * 4;
  this.panelCanvas.height = this.cellSize * 7;

  this.appRoot.innerHTML = '';
  this.newGameButton.innerText = 'New game';
  this.backToMenuButton.innerText = 'Back to menu';

  this.appRoot.appendChild(gameWindow);
  gameWindow.appendChild(boardGrid);
  boardGrid.appendChild(this.boardCanvas);
  boardGrid.appendChild(this.itemCanvas);
  boardGrid.appendChild(this.cursorCanvas);
  gameWindow.appendChild(boardPanel);
  boardPanel.appendChild(this.panelCanvas);
  boardPanel.appendChild(panelButtons);
  panelButtons.appendChild(this.newGameButton);
  panelButtons.appendChild(this.backToMenuButton);
}

/**
 * Function renders game board grid according to the `boardSize` prop
 */
function renderGrid(): void {
  clearCanvas.call(this, this.boardCanvas);

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
      fillColor: ELEMENT_PROPS.cell.background,
      edgingColor: ELEMENT_PROPS.cell.border,
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
      ctx.shadowColor = ELEMENT_PROPS.cell.shadow;
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
      fillColor: ELEMENT_PROPS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top],
    [left + this.cellSize - this.cellSize / cellCornerSize, top],
    [left + this.cellSize, top + this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENT_PROPS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left, top + this.cellSize],
    [left + this.cellSize / cellCornerSize, top + this.cellSize],
    [left, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENT_PROPS.cell.border,
    },
  );

  drawTriangle(
    ctx,
    [left + this.cellSize, top + this.cellSize],
    [left + this.cellSize - this.cellSize / cellCornerSize, top + this.cellSize],
    [left + this.cellSize, top + this.cellSize - this.cellSize / cellCornerSize],
    {
      fillColor: ELEMENT_PROPS.cell.border,
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
        fillColor: item === 2 ? ELEMENT_PROPS.bead.red : ELEMENT_PROPS.bead.blue,
      },
    );
  }
}

/**
 * Function renders a shield icon for the locked cell
 */
function renderShield(): void {
  const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');

  ctx.drawImage(
    this.images.shield.element,
    this.cellSize * this.lockedCell[1] + this.cellSize / 3,
    this.cellSize * this.lockedCell[0] + this.cellSize / 2,
    this.cellSize / 3,
    this.cellSize / 3,
  );
}

/**
 * Function renders a statue movement from one cell to another
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
        fillColor: ELEMENT_PROPS.move.background,
        edgingColor: ELEMENT_PROPS.move.border,
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
  const itemType: number = this.boardMap[itemY] ? this.boardMap[itemY][itemX] : 0;

  if (itemType !== 1 && itemType !== 3) {
    return;
  }

  const enemyType: number = itemType === 1 ? 3 : 1;
  const playerType: string = itemType === 1 ? 'red' : 'blue';

  // If we land on an enemy statue, we should increase
  // the `captured` prop of the corresponding player object.
  // If the player captures the 3rd enemy statue, the game overs.
  if (this.boardMap[cellY][cellX] === enemyType) {
    this.players[playerType].captured += 1;

    if (this.players[playerType].captured === 3) {
      this.isGameOver = true;
    }
  }

  this.boardMap[itemY][itemX] = 0;
  this.boardMap[cellY][cellX] = itemType;

  this.cursor = [];

  // Redraw previously locked statue, removing the shield icon from it
  if (this.lockedCell.length > 0) {
    renderMapItem.call(this, this.lockedCell[1], this.lockedCell[0]);
  }

  this.lockedCell = [cellY, cellX];

  renderMapItem.call(this, itemX, itemY);
  renderMapItem.call(this, cellX, cellY);

  // Since we move a statue, it should be locked without any doubt
  renderShield.call(this);

  checkBeadsPlacing.call(this, cellX, cellY);

  clearCanvas.call(this, this.cursorCanvas);

  // End of turn
  if (!this.isGameOver) {
    this.players = {
      red: {
        ...this.players.red,
        active: itemType === 3,
      },
      blue: {
        ...this.players.blue,
        active: itemType === 1,
      },
    };

    renderPanel.call(this);
  } else {
    processGameOver.call(this, itemType);
  }
}

/**
 * Function renders the game panel which contains visual representation
 * of captured statues count and beads count for each player
 */
function renderPanel(lastItemType?: number): void {
  const ctx: CanvasRenderingContext2D = this.panelCanvas.getContext('2d');

  clearCanvas.call(this, this.panelCanvas);

  if (this.isGameOver === true && lastItemType !== undefined) {
    ctx.font = ELEMENT_PROPS.gameOver.font;
    ctx.fillStyle = ELEMENT_PROPS.gameOver.color;
    ctx.textAlign = ELEMENT_PROPS.gameOver.align;
    ctx.textBaseline = ELEMENT_PROPS.gameOver.baseline;

    ctx.fillText(
      lastItemType === 1 ? 'Red player wins!' : 'Blue player wins!',
      this.cellSize * 2,
      this.cellSize,
    );
  }

  drawRectangle(
    ctx,
    this.cellSize * 0.5 / 2,
    this.cellSize * 2,
    this.cellSize * 3.5,
    this.cellSize * 2,
    {
      edgingColor: ELEMENT_PROPS.panel.red,
      edgingWidth: this.players.red.active ? 15 : 2,
    },
  );

  drawRectangle(
    ctx,
    this.cellSize * 0.5 / 2,
    this.cellSize * 4.5,
    this.cellSize * 3.5,
    this.cellSize * 2,
    {
      edgingColor: ELEMENT_PROPS.panel.blue,
      edgingWidth: this.players.blue.active ? 15 : 2,
    },
  );

  // Red statues captured by the blue player
  for (let x = 0; x < 3; x += 1) {
    if (x < this.players.blue.captured) {
      ctx.drawImage(
        this.images.statueRed.element,
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
            fillColor: ELEMENT_PROPS.bead.red,
          },
        );
      }

      redBeadsCounter += 1;
    }
  }

  // Blue statues captured by the red player
  for (let x = 0; x < 3; x += 1) {
    if (x < this.players.red.captured) {
      ctx.drawImage(
        this.images.statueBlue.element,
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
            fillColor: ELEMENT_PROPS.bead.blue,
          },
        );
      }

      blueBeadsCounter += 1;
    }
  }
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
  renderMapItem,
  renderPossibleMoves,
  renderMove,
  renderPanel,
  clearCanvas,
};
