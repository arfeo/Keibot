import { MAP_ITEM_TYPES, IDLE_MOVES_LIMIT, DIFFICULTY_EASY, DIFFICULTY_HARD } from '../../constants/game';

import { getEnemyType, getPlayerTypeName } from './helpers';
import { changeMapValue, getMapItemsByType } from '../../core/utils/game';

import { GameState, Players, ApplyMoveResult } from './types';

interface Cell {
  cellX: number;
  cellY: number;
}

type CellWithBead = Cell & {
  targetX: number;
  targetY: number;
}

function checkPossibleMoves(gameState: GameState, x: number, y: number): number[][] | undefined {
  const { boardMap, lockedCell } = gameState;
  const itemType: number = boardMap[y] ? boardMap[y][x] : 0;
  const playerTypeName: string = getPlayerTypeName(itemType);
  const { lockedStatue } = gameState.players[playerTypeName];
  const isStatueLocked: boolean = lockedStatue && (lockedStatue[0] === y && lockedStatue[1] === x);

  if ((itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) || isStatueLocked) {
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

function checkMoveToCell(
  gameState: GameState,
  itemX: number,
  itemY: number,
  cellX: number,
  cellY: number,
): boolean {
  const { boardMap } = gameState;

  if (!boardMap[itemY] || boardMap[itemY][itemX] === undefined) {
    return false;
  }

  const possibleMoves: number[][] | undefined = checkPossibleMoves(gameState, itemX, itemY);

  return Array.isArray(possibleMoves) && possibleMoves.map((move: number[]) => {
    return JSON.stringify(move);
  }).indexOf(JSON.stringify([cellY, cellX])) > -1;
}

function checkBeadsPlacing(gameState: GameState, x: number, y: number, itemType: number): number[][] {
  if ((itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue)) {
    return [];
  }

  const ownBead: number = itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.red.bead : MAP_ITEM_TYPES.blue.bead;
  const playerTypeName: string = getPlayerTypeName(itemType);
  const enemyType: number = getEnemyType(itemType);
  let boardMap: number[][] = [...gameState.boardMap];
  let playerBeads: number = gameState.players[playerTypeName].beads;
  const beadsCoordinates: number[][] = [];

  const placeBead = (beadX: number, beadY: number): void => {
    if (playerBeads === 0) {
      return;
    }

    boardMap = changeMapValue(boardMap, x, y, ownBead);
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

function checkEnemyHasMoves(gameState: GameState, itemType: number): boolean {
  const { boardMap } = gameState;

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
    const possibleMoves: number[][] | undefined = checkPossibleMoves(gameState, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    moves.push(...possibleMoves);
  }

  return moves.length > 0;
}

function checkUnderAttack(gameState: GameState, x: number, y: number): boolean {
  const { boardMap, lockedCell } = gameState;
  const itemType = boardMap[y] ? boardMap[y][x] : 0;
  const [lockedY, lockedX] = lockedCell;
  const isCellLocked: boolean = lockedX === x && lockedY === y;
  const isStatue: boolean = itemType === MAP_ITEM_TYPES.red.statue || itemType === MAP_ITEM_TYPES.blue.statue;

  if (isCellLocked || !isStatue) {
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

function applyMove(
  gameState: GameState,
  itemX: number,
  itemY: number,
  cellX: number,
  cellY: number,
  difficultyLevel: number,
): ApplyMoveResult | null {
  let boardMap: number[][] = [...gameState.boardMap];
  let lockedCell: number[] = [...gameState.lockedCell];
  let { isGameOver, idleMovesCounter } = gameState;
  const itemType: number = boardMap[itemY] ? boardMap[itemY][itemX] : 0;

  // We've got the idle move presumption. If the move is not idle,
  // we set `idleMovesCounter` to zero below (for all difficulty levels beside the Easy one)
  if (difficultyLevel !== DIFFICULTY_EASY) {
    idleMovesCounter += 1;
  }

  if (itemType !== MAP_ITEM_TYPES.red.statue && itemType !== MAP_ITEM_TYPES.blue.statue) {
    return;
  }

  const ownBead: number = itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.red.bead : MAP_ITEM_TYPES.blue.bead;
  const enemyType: number = getEnemyType(itemType);
  const playerTypeName: string = getPlayerTypeName(itemType);

  let players: Players = {
    ...gameState.players,
    [playerTypeName]: {
      ...gameState.players[playerTypeName],
      lockedStatue: gameState.players[playerTypeName].move === 0 && difficultyLevel === DIFFICULTY_HARD
        ? [cellY, cellX]
        : [],
      move: gameState.players[playerTypeName].move + 1,
    },
  };

  // If we land on an enemy statue, we should increase
  // the `captured` prop of the corresponding player object.
  // If the player captures the 3rd enemy statue, the game is over
  if (boardMap[cellY][cellX] === enemyType) {
    idleMovesCounter = 0;
    players[playerTypeName].captured += 1;

    if (players[playerTypeName].captured === 3) {
      isGameOver = true;
    }
  }

  boardMap = changeMapValue(boardMap, itemX, itemY, 0);
  boardMap = changeMapValue(boardMap, cellX, cellY, itemType);

  lockedCell = [cellY, cellX];

  const beadsCoordinates: number[][] = checkBeadsPlacing({
    boardMap,
    players,
    difficultyLevel,
  }, cellX, cellY, itemType);

  for (const bead of beadsCoordinates) {
    idleMovesCounter = 0;
    boardMap = changeMapValue(boardMap, bead[1], bead[0], ownBead);

    players = {
      ...players,
      [playerTypeName]: {
        ...players[playerTypeName],
        beads: players[playerTypeName].beads - 1,
      },
    };

    // No beads left -- game over, current player wins
    // Got three beads in a row (horizontally, vertically, or diagonally) -- the game is over
    if (players[playerTypeName].beads === 0 || checkThreeInARow(boardMap) === true) {
      isGameOver = true;
    }
  }

  // If enemy hasn't got possible moves, current user wins
  if (!checkEnemyHasMoves({ boardMap, lockedCell, players, difficultyLevel }, itemType)) {
    isGameOver = true;
  }

  // Several idle rounds result in a draw on Normal+ difficulty levels
  if (idleMovesCounter === IDLE_MOVES_LIMIT) {
    isGameOver = true;
  }

  return [
    // Yes, newly added beads are already written in the board map,
    // but we return them separately to avoid full redraw of the item canvas,
    // and to insert them surgically after the move animation completes
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
      idleMovesCounter,
      difficultyLevel,
    },
  ];
}

export {
  checkPossibleMoves,
  checkMoveToCell,
  checkUnderAttack,
  applyMove,
};
