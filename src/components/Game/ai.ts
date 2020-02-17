import { COMPUTER_MOVE_TIMEOUT, MAP_ITEM_TYPES } from '../../constants/game';

import { getEnemyType, getMapItemsByType, getRandomNum } from './helpers';
import { checkBeadsPlacing, checkPossibleMoves, checkUnderAttack } from './actions';
import { renderMove, renderGameOver } from './render';

interface Move {
  evaluation: number;
  move: number[][];
}

/**
 * Function renders the chosen best move
 */
function aiMove(): Promise<void> {
  return new Promise((resolve) => {
    const move: number[][] = aiMiniMax.call(this, this.boardMap, 0, true);

    // No moves for computer -- the blue player wins
    if (move.length === 0) {
      this.isGameOver = true;

      renderGameOver.call(this, MAP_ITEM_TYPES.blue.statue);
    }

    // Computer is too quick, so we set a timeout
    window.setTimeout(() => {
      renderMove.call(this, move[0][1], move[0][0], move[1][1], move[1][0]).then(() => {
        resolve();
      });
    }, COMPUTER_MOVE_TIMEOUT * 1000);
  });
}

function aiMiniMax(node: number[][], depth = 0, maximizingPlayer = true): number[][] {
  if (depth === 0 || this.isGameOver === true) {
    const itemType: number = maximizingPlayer === true ? MAP_ITEM_TYPES.red.statue : MAP_ITEM_TYPES.blue.statue;
    const moves: Move[] = aiGetEvaluatedMoves.call(this, itemType);
    const evaluations: number[] = moves.map((i: Move): number => i.evaluation);
    const evaluation: number = maximizingPlayer ? Math.max(...evaluations) : Math.min(...evaluations);
    const processedMoves: Move[] = moves.filter((move: Move) => move.evaluation === evaluation);

    return processedMoves[getRandomNum(0, processedMoves.length - 1)].move;
  }

  /* let bestMoveValue: number = maximizingPlayer ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;

  if (maximizingPlayer) {
    // ...
  } else  {
    // ...
  }*/
}

/**
 * Function finds all possible moves for all computer's statues,
 * evaluates each of them, picks ones with the max evaluation,
 * and returns one random move from the result array
 *
 * @param itemType
 */
function aiGetEvaluatedMoves(itemType: number): Move[] {
  const ownStatues: number[][] = getMapItemsByType(this.boardMap, itemType);
  const moves: Move[] = [];

  if (ownStatues.length === 0) {
    return [];
  }

  for (const statue of ownStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves({
      boardMap: this.boardMap,
      lockedCell: this.lockedCell,
    }, statue[1], statue[0]);

    if (possibleMoves === undefined || !Array.isArray(possibleMoves) || possibleMoves.length === 0) {
      continue;
    }

    for (const possibleMove of possibleMoves) {
      moves.push({
        evaluation: aiEvaluateMove.call(this, possibleMove[1], possibleMove[0], statue),
        move: [
          statue,
          possibleMove,
        ],
      });
    }
  }

  return moves;
}

/**
 * Function evaluates a computer's statue move by several parameters,
 * and returns the total evaluation
 *
 * @param x
 * @param y
 * @param item
 * @param itemType
 */
function aiEvaluateMove(x: number, y: number, item: number[]): number {
  const itemType: number = Array.isArray(item) && item.length === 2 ? this.boardMap[item[1]][item[0]] : 0;
  const ownStatues: number[][] = getMapItemsByType(this.boardMap, itemType);
  const otherStatues: number[][] = ownStatues.filter((statue: number[]) => {
    return !(statue[0] === item[0] && statue[1] === item[1]);
  });

  let result = 0;

  // Count of beads to be placed (positive)
  result += checkBeadsPlacing.call(this, x, y, true, itemType);

  const enemyType: number = getEnemyType(itemType);

  // Is there an enemy statue on the target cell (positive)
  if (this.boardMap[y][x] === enemyType) {
    result += 2;
  }

  // Is there any other statue under attack (negative)
  const isUnderAttack: boolean = otherStatues.map((statue: number[]) => {
    return checkUnderAttack.call(this, statue[1], statue[0]);
  }).some((value: boolean) => value === true);

  if (isUnderAttack) {
    result -= 10;
  }

  return result;
}

export { aiMove };
