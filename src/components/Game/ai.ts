import { COMPUTER_MOVE_TIMEOUT, MAP_ITEM_TYPES } from '../../constants/game';

import { getMapItemsByType, getRandomNum } from './helpers';
import { checkBeadsPlacing, checkPossibleMoves, checkUnderAttack, processGameOver } from './actions';
import { renderMove } from './render';

interface Move {
  evaluation: number;
  move: number[][];
}

/**
 * Function renders the chosen best move
 */
function aiMove(): void {
  const move: number[][] = aiChooseBestMove.call(this);

  // No moves for computer -- the blue player wins
  if (move.length === 0) {
    this.isGameOver = true;

    processGameOver.call(this, MAP_ITEM_TYPES.blue.statue);
  }

  // Computer is too quick, so we set a timeout
  window.setTimeout(() => {
    renderMove.call(this, move[0][1], move[0][0], move[1][1], move[1][0]);
  }, COMPUTER_MOVE_TIMEOUT * 1000);
}

/**
 * Function finds all possible moves for all computer's statues,
 * evaluates each of them, picks ones with the max evaluation,
 * and returns one random move from the result array
 */
function aiChooseBestMove(): number[][] {
  const ownStatues: number[][] = getMapItemsByType(this.boardMap, MAP_ITEM_TYPES.red.statue);
  const moves: Move[] = [];

  if (ownStatues.length === 0) {
    return [];
  }

  for (const statue of ownStatues) {
    const possibleMoves: number[][] | undefined = checkPossibleMoves.call(this, statue[1], statue[0]);

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

  const maxEvaluation: number = Math.max.apply(Math, moves.map((i: Move): number => i.evaluation));
  const processedMoves: Move[] = moves.filter((move: Move) => move.evaluation === maxEvaluation);

  return processedMoves[getRandomNum(0, processedMoves.length - 1)].move;
}

/**
 * Function evaluates a computer's statue move by several parameters,
 * and returns the total evaluation
 *
 * @param x
 * @param y
 * @param item
 */
function aiEvaluateMove(x: number, y: number, item: number[]): number {
  const ownStatues: number[][] = getMapItemsByType(this.boardMap, MAP_ITEM_TYPES.red.statue);
  const otherStatues: number[][] = ownStatues.filter((s: number[]) => JSON.stringify(s) !== JSON.stringify(item));
  let result = 0;

  // Count of beads to be placed (positive)
  result += checkBeadsPlacing.call(this, x, y, true, MAP_ITEM_TYPES.red.statue);

  // Is there an enemy statue on the target cell (positive)
  if (this.boardMap[y][x] === MAP_ITEM_TYPES.blue.statue) {
    result += 2;
  }

  // Is there any other statue under attack (negative)
  if (otherStatues.map((s: number[]) => checkUnderAttack.call(this, s[1], s[0])).some((r: boolean) => r === true)) {
    result -= 2;
  }

  return result;
}

export { aiMove };
