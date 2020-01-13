import { MAP_ITEM_TYPES } from '../../constants/game';

import { renderMapItem, renderPanel } from './render';
import { getMapItemsByType, isThreeInARow } from './helpers';

interface Cell {
  cellX: number;
  cellY: number;
}

type CellWithBead = Cell & {
  targetX: number;
  targetY: number;
}

/**
 * Function checks the ability of a statue with the given coordinates to move;
 * it returns an array of possible coordinates or undefined if no statue found
 * on the board by the given coordinates
 *
 * @param x
 * @param y
 */
function checkPossibleMoves(x: number, y: number): number[][] | undefined {
  const itemType: number = this.boardMap[y] ? this.boardMap[y][x] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  const enemyType: number = itemType === MAP_ITEM_TYPES.red.statue
    ? MAP_ITEM_TYPES.blue.statue
    : MAP_ITEM_TYPES.red.statue;

  const moves: number[][] = [];

  // If the target cell is empty, return true;
  // if there's an enemy statue on the target cell -- check whether it is locked or not;
  // if it's not locked, return true, otherwise return false
  const checkCell = (targetX: number, targetY: number): boolean => {
    if (this.boardMap[targetY][targetX] === enemyType) {
      return this.lockedCell.length > 0 ? this.lockedCell[1] !== targetX || this.lockedCell[0] !== targetY : true;
    }

    return this.boardMap[targetY][targetX] === 0;
  };

  const processCells = (cells: Cell[]): void => {
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
      return;
    }

    cells.forEach((cell: Cell) => {
      if (this.boardMap[cell.cellY] !== undefined && checkCell(cell.cellX, cell.cellY)) {
        moves.push([cell.cellY, cell.cellX]);
      }
    });
  };

  processCells([
    { cellX: x - 1, cellY: y - 2 },
    { cellX: x + 1, cellY: y - 2 },
    { cellX: x - 2, cellY: y + 1 },
    { cellX: x + 2, cellY: y + 1 },
    { cellX: x - 1, cellY: y + 2 },
    { cellX: x + 1, cellY: y + 2 },
    { cellX: x - 2, cellY: y - 1 },
    { cellX: x + 2, cellY: y - 1 },
  ]);

  return moves;
}

/**
 * Function checks the ability to move a statue with the given coordinates to move to a cell
 * with the given coordinates; returns true if the move is possible, otherwise returns false
 *
 * @param itemX
 * @param itemY
 * @param cellX
 * @param cellY
 */
function checkMoveToCell(itemX: number, itemY: number, cellX: number, cellY: number): boolean {
  if (!this.boardMap[itemY] || this.boardMap[itemY][itemX] === undefined) {
    return false;
  }

  const possibleMoves: number[][] | undefined = checkPossibleMoves.call(this, itemX, itemY);

  return Array.isArray(possibleMoves)
    && possibleMoves.map((move: number[]) => JSON.stringify(move)).indexOf(JSON.stringify([cellY, cellX])) > -1;
}

/**
 * Function checks whether new beads are needed to be placed on the board or not
 * after placing a statue to a cell with the given coordinates;
 * if `countOnly` param is set to true, function doesn't actually place any beads
 * on the map, but returns the total beads count instead
 *
 * @param x
 * @param y
 * @param countOnly
 * @param countFor
 */
function checkBeadsPlacing(x: number, y: number, countOnly?: boolean, countFor?: number): void | number {
  const itemType: number = countFor ?? (this.boardMap[y] ? this.boardMap[y][x] : 0);
  let count = 0;

  if ((itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) || this.isGameOver) {
    return countOnly === true ? count : null;
  }

  const ownBead: number = itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.red.bead : MAP_ITEM_TYPES.blue.bead;

  const enemyType: number = itemType === MAP_ITEM_TYPES.red.statue
    ? MAP_ITEM_TYPES.blue.statue
    : MAP_ITEM_TYPES.red.statue;

  const playerType: string = itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue';

  // If we place a bead on the game board, we should reduce `beads` count of the
  // corresponding player object. If there's no beads left, the player wins;
  // if the player got three beads in a row, he also wins.
  const placeBead = (beadX: number, beadY: number): void => {
    if (this.players[playerType].beads === 0) {
      return;
    }

    if (countOnly !== true) {
      this.boardMap[beadY][beadX] = ownBead;

      renderMapItem.call(this, beadX, beadY);

      this.players[playerType].beads -= 1;

      // No beads left -- game over
      // Got three beads in a row (horizontally, vertically, or diagonally) -- game over
      if (this.players[playerType].beads === 0 || isThreeInARow(this.boardMap) === true) {
        this.isGameOver = true;
      }
    } else {
      count += 1;
    }
  };

  const processCells = (cells: CellWithBead[]): void => {
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
      return;
    }

    cells.forEach((cell: CellWithBead): void => {
      if (this.boardMap[cell.cellY] === undefined) {
        return;
      }

      if (this.boardMap[cell.cellY][cell.cellX] === enemyType && this.boardMap[cell.targetY][cell.targetX] === 0) {
        placeBead(cell.targetX, cell.targetY);
      }
    });
  };

  processCells([
    { cellX: x - 2,   cellY: y - 2,   targetX: x - 1,   targetY: y - 1},
    { cellX: x,       cellY: y - 2,   targetX: x,       targetY: y - 1},
    { cellX: x + 2,   cellY: y - 2,   targetX: x + 1,   targetY: y - 1},
    { cellX: x - 2,   cellY: y,       targetX: x - 1,   targetY: y},
    { cellX: x + 2,   cellY: y,       targetX: x + 1,   targetY: y},
    { cellX: x - 2,   cellY: y + 2,   targetX: x - 1,   targetY: y + 1},
    { cellX: x,       cellY: y + 2,   targetX: x,       targetY: y + 1},
    { cellX: x + 2,   cellY: y + 2,   targetX: x + 1,   targetY: y + 1},
  ]);

  if (countOnly === true) {
    return count;
  }
}

/**
 * Function checks is there any enemies within one turn reach about
 * the cell with the given coordinates
 *
 * @param x
 * @param y
 */
function checkUnderAttack(x: number, y: number): boolean {
  const itemType = this.boardMap[y] ? this.boardMap[y][x] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return false;
  }

  const enemyType: number = itemType === MAP_ITEM_TYPES.red.statue
    ? MAP_ITEM_TYPES.blue.statue
    : MAP_ITEM_TYPES.red.statue;

  if (this.boardMap[y - 2] !== undefined) {
    return this.boardMap[y - 2][x - 1] === enemyType || this.boardMap[y - 2][x + 1] === enemyType;
  }

  if (this.boardMap[y + 1] !== undefined) {
    return this.boardMap[y + 1][x - 1] === enemyType || this.boardMap[y + 1][x + 2] === enemyType;
  }

  if (this.boardMap[y + 2] !== undefined) {
    return this.boardMap[y + 2][x - 1] === enemyType || this.boardMap[y + 2][x + 1] === enemyType;
  }

  if (this.boardMap[y - 1] !== undefined) {
    return this.boardMap[y - 1][x - 2] === enemyType || this.boardMap[y - 1][x + 2] === enemyType;
  }

  return false;
}

/**
 * Function checks possible moves for each enemy's statue, and returns true
 * if there's at least one statue and one possible move; it also returns true
 * if the `itemType` attribute is not a statue type (to avoid blocking the game);
 * otherwise it returns false
 *
 * @param itemType
 */
function checkEnemyHasMoves(itemType: number): boolean {
  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return true;
  }

  const enemyType: number = itemType === MAP_ITEM_TYPES.red.statue
    ? MAP_ITEM_TYPES.blue.statue
    : MAP_ITEM_TYPES.red.statue;

  const enemyStatues: number[][] = getMapItemsByType(this.boardMap, enemyType);
  const moves: number[][] = [];

  if (enemyStatues.length === 0) {
    return false;
  }

  for (const statue of enemyStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves.call(this, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    moves.push(...possibleMoves);
  }

  return moves.length > 0;
}

/**
 * Function deactivates both users and re-renders the game panel
 * on game over
 */
function processGameOver(lastItemType: number): void {
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

export {
  checkPossibleMoves,
  checkMoveToCell,
  checkBeadsPlacing,
  checkUnderAttack,
  checkEnemyHasMoves,
  processGameOver,
};
