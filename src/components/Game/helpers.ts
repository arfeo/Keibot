import { MAP_ITEM_TYPES } from '../../constants/game';

function getEnemyType(itemType: number): number {
  return itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.blue.statue : MAP_ITEM_TYPES.red.statue;
}

function getPlayerTypeName(itemType: number): string {
  return itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue';
}

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
  getEnemyType,
  getPlayerTypeName,
  clearCanvas,
};
