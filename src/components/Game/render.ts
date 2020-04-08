import { BEADS_COUNT, ELEMENT_PROPS, MAP_ITEM_TYPES, IDLE_MOVES_LIMIT } from '../../constants/game';

import { drawCircle, drawImage, drawRectangle, drawTriangle } from '../../utils/drawing';
import { applyMove } from './actions';
import { animateItemFade } from './animations';

import { ApplyMoveResult } from './types';

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
      edgingWidth: this.cellSize / 40,
    },
  );

  // Random background noise
  const hmTimes = Math.round(this.cellSize * 2);

  for (let i = 0; i <= hmTimes; i += 1) {
    const randomX = Math.floor((Math.random() * this.cellSize) + 1);
    const randomY = Math.floor((Math.random() * this.cellSize) + 1);
    const randomSize = Math.floor((Math.random() * 1.3 * this.cellSize / 75) + 1);
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

  if (item === MAP_ITEM_TYPES.red.statue || item === MAP_ITEM_TYPES.blue.statue) {
    drawImage(
      ctx,
      item === MAP_ITEM_TYPES.red.statue ? this.images.statueRed : this.images.statueBlue,
      this.cellSize * x + 5,
      this.cellSize * y + 5,
      this.cellSize - 10,
      this.cellSize - 10,
    );
  }

  if (item === MAP_ITEM_TYPES.red.bead || item === MAP_ITEM_TYPES.blue.bead) {
    const posX: number = this.cellSize * x + this.cellSize / 2;
    const posY: number = this.cellSize * y + this.cellSize / 2;

    drawCircle(
      ctx,
      posX,
      posY,
      this.cellSize / 4,
      {
        fillColor: item === MAP_ITEM_TYPES.red.bead ? ELEMENT_PROPS.bead.red : ELEMENT_PROPS.bead.blue,
      },
    );
  }
}

/**
 * Function renders a shield icon for the locked cell
 */
function renderShield(): void {
  const ctx: CanvasRenderingContext2D = this.itemCanvas.getContext('2d');

  drawImage(
    ctx,
    this.images.shield,
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
      this.cellSize / 8,
      {
        fillColor: ELEMENT_PROPS.move.background,
        edgingColor: ELEMENT_PROPS.move.border,
        edgingWidth: this.cellSize / 20,
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
async function renderMove(itemX: number, itemY: number, cellX: number, cellY: number): Promise<void> {
  const itemType: number = this.boardMap[itemY] ? this.boardMap[itemY][itemX] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  this.isMoving = true;
  this.cursor = [];

  clearCanvas.call(this, this.cursorCanvas);

  await animateItemFade.call(this, itemX, itemY, 'out');

  const moveResult: ApplyMoveResult = applyMove({
    boardMap: this.boardMap,
    lockedCell: this.lockedCell,
    players: this.players,
    idleMovesCounter: this.idleMovesCounter,
    isGameOver: this.isGameOver,
  }, itemX, itemY, cellX, cellY, this.difficultyLevel);

  const [beadsCoordinates, gameState]: ApplyMoveResult = moveResult;

  this.boardMap = gameState.boardMap;
  this.players = gameState.players;
  this.idleMovesCounter = gameState.idleMovesCounter;
  this.isGameOver = gameState.isGameOver;

  await animateItemFade.call(this, cellX, cellY, 'in');

  // Redraw previously locked statue, removing the shield icon from it
  if (this.lockedCell.length > 0) {
    renderMapItem.call(this, this.lockedCell[1], this.lockedCell[0]);
  }

  this.lockedCell = gameState.lockedCell;

  // Since we move a statue, it should be locked without any doubt
  renderShield.call(this);

  // Render new beads on the game board (if any)
  for (const bead of beadsCoordinates) {
    renderMapItem.call(this, bead[1], bead[0]);
  }

  this.isMoving = false;

  if (!this.isGameOver) {
    renderPanel.call(this);
  } else {
    renderGameOver.call(this, itemType);
  }

  return Promise.resolve();
}

/**
 * Function renders the game panel which contains visual representation
 * of captured statues count and beads count for each player
 *
 * @param lastItemType
 */
function renderPanel(lastItemType?: number): void {
  const ctx: CanvasRenderingContext2D = this.panelCanvas.getContext('2d');

  clearCanvas.call(this, this.panelCanvas);

  if (this.isGameOver === true && lastItemType !== undefined) {
    ctx.font = ELEMENT_PROPS.gameOver.font;
    ctx.fillStyle = ELEMENT_PROPS.gameOver.color;
    ctx.textAlign = ELEMENT_PROPS.gameOver.align;
    ctx.textBaseline = ELEMENT_PROPS.gameOver.baseline;

    const message = this.idleMovesCounter === IDLE_MOVES_LIMIT ? 'Draw!' : this.isComputerOn
      ? (lastItemType === MAP_ITEM_TYPES.red.statue ? 'You lose!' : 'You win!')
      : (lastItemType === MAP_ITEM_TYPES.red.statue ? 'Red player wins!' : 'Blue player wins!');

    ctx.fillText(
      message,
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
      edgingColor: ELEMENT_PROPS.panel.blue,
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
            fillColor: ELEMENT_PROPS.bead.blue,
          },
        );
      }

      blueBeadsCounter += 1;
    }
  }
}

/**
 * Function deactivates both users and re-renders the game panel
 * on game over
 *
 * @param lastItemType
 */
function renderGameOver(lastItemType: number): void {
  this.players = {
    red: {
      ...this.players.red,
      active: false,
    },
    blue: {
      ...this.players.blue,
      active: false,
    },
  };

  renderPanel.call(this, lastItemType);
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
  renderPanel,
  clearCanvas,
};
