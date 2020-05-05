import { MAP_ITEM_TYPES } from '../../../constants/game';

import { drawCircle, drawImage } from '../../../core/utils/drawing';

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
        fillColor: item === MAP_ITEM_TYPES.red.bead
          ? 'rgb(255, 0, 0)'
          : 'rgb(0, 0, 255)',
      },
    );
  }
}

export {
  renderMap,
  renderMapItem,
};
