import { MAP_ITEM_TYPES } from '../../constants/game';

import { getMapItemsByType, getEnemyType } from './helpers';

import { BoardDescription, Players } from './types';

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
 * @param boardDescription
 * @param x
 * @param y
 */
function checkPossibleMoves(boardDescription: BoardDescription, x: number, y: number): number[][] | undefined {
  const { boardMap, lockedCell } = boardDescription;
  const itemType: number = boardMap[y] ? boardMap[y][x] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  const enemyType: number = getEnemyType(itemType);
  const moves: number[][] = [];

  // If the target cell is empty, return true;
  // if there's an enemy statue on the target cell -- check whether it is locked or not;
  // if it's not locked, return true, otherwise return false
  const checkCell = (targetX: number, targetY: number): boolean => {
    if (boardMap[targetY][targetX] === enemyType) {
      return lockedCell.length > 0 ? lockedCell[1] !== targetX || lockedCell[0] !== targetY : true;
    }

    return boardMap[targetY][targetX] === 0;
  };

  const processCells = (cells: Cell[]): void => {
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
      return;
    }

    cells.forEach((cell: Cell) => {
      if (boardMap[cell.cellY] !== undefined && checkCell(cell.cellX, cell.cellY)) {
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
 * @param boardDescription
 * @param itemX
 * @param itemY
 * @param cellX
 * @param cellY
 */
function checkMoveToCell(
  boardDescription: BoardDescription,
  itemX: number,
  itemY: number,
  cellX: number,
  cellY: number,
): boolean {
  const { boardMap, lockedCell } = boardDescription;

  if (!boardMap[itemY] || boardMap[itemY][itemX] === undefined) {
    return false;
  }

  const possibleMoves: number[][] | undefined = checkPossibleMoves({ boardMap, lockedCell }, itemX, itemY);

  return Array.isArray(possibleMoves) && possibleMoves.map((move: number[]) => {
    return JSON.stringify(move);
  }).indexOf(JSON.stringify([cellY, cellX])) > -1;
}

/**
 * Function checks whether new beads are needed to be placed on the board or not
 * after placing a statue to a cell with the given coordinates;
 * it returns an object with the following keys:
 *  ~ beadsCoordinates -- an array of beads coordinates (if any)
 *  ~ boardDescription -- modified board description
 *
 * @param boardDescription
 * @param x
 * @param y
 * @param itemType
 */
function checkBeadsPlacing(boardDescription: BoardDescription, x: number, y: number, itemType: number): number[][] {
  if ((itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue)) {
    return [];
  }

  const ownBead: number = itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.red.bead : MAP_ITEM_TYPES.blue.bead;
  const playerTypeName: string = itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue';
  const enemyType: number = getEnemyType(itemType);
  let boardMap: number[][] = [...boardDescription.boardMap];
  let playerBeads: number = boardDescription.players[playerTypeName].beads;
  const beadsCoordinates: number[][] = [];

  const placeBead = (beadX: number, beadY: number): void => {
    if (playerBeads === 0) {
      return;
    }

    boardMap = boardMap.map((row: number[], rowIndex: number) => row.map((column: number, columnIndex: number) => {
      return rowIndex === y && columnIndex === x ? ownBead : boardMap[rowIndex][columnIndex];
    }));

    playerBeads -= 1;

    beadsCoordinates.push([beadY, beadX]);
  };

  const processCells = (cells: CellWithBead[]): void => {
    if (!cells || !Array.isArray(cells) || cells.length === 0) {
      return;
    }

    cells.forEach((cell: CellWithBead): void => {
      if (boardMap[cell.cellY] === undefined) {
        return;
      }

      if (boardMap[cell.cellY][cell.cellX] === enemyType && boardMap[cell.targetY][cell.targetX] === 0) {
        placeBead(cell.targetX, cell.targetY);
      }
    });
  };

  processCells([
    { cellX: x - 2,   cellY: y - 2,   targetX: x - 1,   targetY: y - 1 },
    { cellX: x,       cellY: y - 2,   targetX: x,       targetY: y - 1 },
    { cellX: x + 2,   cellY: y - 2,   targetX: x + 1,   targetY: y - 1 },
    { cellX: x - 2,   cellY: y,       targetX: x - 1,   targetY: y },
    { cellX: x + 2,   cellY: y,       targetX: x + 1,   targetY: y },
    { cellX: x - 2,   cellY: y + 2,   targetX: x - 1,   targetY: y + 1 },
    { cellX: x,       cellY: y + 2,   targetX: x,       targetY: y + 1 },
    { cellX: x + 2,   cellY: y + 2,   targetX: x + 1,   targetY: y + 1 },
  ]);

  return beadsCoordinates;
}

/**
 * Function checks is there any enemies within one turn reach about
 * the cell with the given coordinates
 *
 * @param boardMap
 * @param x
 * @param y
 */
function checkUnderAttack(boardMap: number[][], x: number, y: number): boolean {
  const itemType = boardMap[y] ? boardMap[y][x] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return false;
  }

  const enemyType: number = getEnemyType(itemType);

  const isUnderAttack1 = boardMap[y - 2] !== undefined
    && (boardMap[y - 2][x - 1] === enemyType || boardMap[y - 2][x + 1] === enemyType);
  const isUnderAttack2 = boardMap[y + 1] !== undefined
    && (boardMap[y + 1][x - 2] === enemyType || boardMap[y + 1][x + 2] === enemyType);
  const isUnderAttack3 = boardMap[y + 2] !== undefined
    && (boardMap[y + 2][x - 1] === enemyType || boardMap[y + 2][x + 1] === enemyType);
  const isUnderAttack4 = boardMap[y - 1] !== undefined
    && (boardMap[y - 1][x - 2] === enemyType || boardMap[y - 1][x + 2] === enemyType);

  return isUnderAttack1 || isUnderAttack2 || isUnderAttack3 || isUnderAttack4;
}

/**
 * Function checks whether there're three beads in a row on the game board
 * (vertically, horizontally, or diagonally)
 *
 * @param boardMap
 */
function checkThreeInARow(boardMap: number[][]): boolean {
  if (!boardMap || !Array.isArray(boardMap)) {
    return false;
  }

  for (let y = 0; y < boardMap.length; y += 1) {
    for (let x = 0; x < boardMap[y].length; x += 1) {
      const item = boardMap[y][x];

      if (item !== MAP_ITEM_TYPES.red.bead && item !== MAP_ITEM_TYPES.blue.bead) {
        continue;
      }

      if (boardMap[y][x + 1] === item && boardMap[y][x + 2] === item) {
        return true;
      }

      if (boardMap[y + 1] !== undefined && boardMap[y + 2] !== undefined && (
        boardMap[y + 1][x] === item && boardMap[y + 2][x] === item
        || boardMap[y + 1][x + 1] === item && boardMap[y + 2][x + 2] === item
        || boardMap[y + 1][x - 1] === item && boardMap[y + 2][x - 2] === item
      )) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Function checks possible moves for each enemy's statue, and returns true
 * if there's at least one statue and one possible move; it also returns true
 * if the `itemType` attribute is not a statue type (to avoid blocking the game);
 * otherwise it returns false
 *
 * @param boardDescription
 * @param itemType
 */
function checkEnemyHasMoves(boardDescription: BoardDescription, itemType: number): boolean {
  const { boardMap, lockedCell } = boardDescription;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return true;
  }

  const enemyType: number = getEnemyType(itemType);
  const enemyStatues: number[][] = getMapItemsByType(boardMap, enemyType);
  const moves: number[][] = [];

  if (enemyStatues.length === 0) {
    return false;
  }

  for (const statue of enemyStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves({ boardMap, lockedCell }, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    moves.push(...possibleMoves);
  }

  return moves.length > 0;
}

/**
 * ...
 *
 * @param boardDescription
 * @param itemX
 * @param itemY
 * @param cellX
 * @param cellY
 */
function applyMove(
  boardDescription: BoardDescription,
  itemX: number,
  itemY: number,
  cellX: number,
  cellY: number,
): [number[][], BoardDescription] | null {
  const boardMap: number[][] = [...boardDescription.boardMap];
  let lockedCell: number[] = [...boardDescription.lockedCell];
  let { isGameOver } = boardDescription;
  const itemType: number = boardMap[itemY] ? boardMap[itemY][itemX] : 0;

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  const ownBead: number = itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.red.bead : MAP_ITEM_TYPES.blue.bead;
  const enemyType: number = getEnemyType(itemType);
  const playerTypeName: string = itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue';
  const players: Players = {
    ...boardDescription.players,
    [playerTypeName]: {
      ...boardDescription.players[playerTypeName],
    },
  };

  // If we land on an enemy statue, we should increase
  // the `captured` prop of the corresponding player object.
  // If the player captures the 3rd enemy statue, the game overs.
  if (boardMap[cellY][cellX] === enemyType) {
    players[playerTypeName].captured += 1;

    if (players[playerTypeName].captured === 3) {
      isGameOver = true;
    }
  }

  boardMap[itemY][itemX] = 0;
  boardMap[cellY][cellX] = itemType;
  lockedCell = [cellY, cellX];

  const beadsCoordinates: number[][] = checkBeadsPlacing({ boardMap, players }, cellX, cellY, itemType);

  for (const bead of beadsCoordinates) {
    const [beadY, beadX]: number[] = bead;

    boardMap[beadY][beadX] = ownBead;
    players[playerTypeName].beads -= 1;

    // No beads left -- game over, current player wins
    // Got three beads in a row (horizontally, vertically, or diagonally) -- game over
    if (players[playerTypeName].beads === 0 || checkThreeInARow(boardMap) === true) {
      isGameOver = true;
    }
  }

  // If enemy hasn't got possible moves, current user wins
  if (!checkEnemyHasMoves({ boardMap, lockedCell }, itemType)) {
    isGameOver = true;
  }

  return [
    beadsCoordinates,
    {
      boardMap,
      lockedCell,
      players: !isGameOver ? {
        red: {
          ...players.red,
          active: itemType === MAP_ITEM_TYPES.blue.statue,
        },
        blue: {
          ...players.blue,
          active: itemType === MAP_ITEM_TYPES.red.statue,
        },
      } : players,
      isGameOver,
    },
  ];
}

export {
  checkPossibleMoves,
  checkMoveToCell,
  checkBeadsPlacing,
  checkUnderAttack,
  checkThreeInARow,
  checkEnemyHasMoves,
  applyMove,
};
