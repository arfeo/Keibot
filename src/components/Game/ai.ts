import { getMapItemsByType, getRandomNum } from './helpers';
import { checkPossibleMoves, processGameOver } from './actions';
import { renderMove } from './render';

function aiMove(): void {
  const move: number[][] = aiChooseBestMove.call(this);

  // No moves for computer -- the blue player wins
  if (move.length === 0) {
    this.isGameOver = true;

    processGameOver.call(this, 3);
  }

  // Computer is too quick, so we set a timeout
  window.setTimeout(() => {
    renderMove.call(this, move[0][1], move[0][0], move[1][1], move[1][0]);
  }, 1000);
}

function aiChooseBestMove(): number[][] {
  const ownStatues: number[][] = getMapItemsByType(this.boardMap, 1);
  let result: number[][] = [];

  while(result.length === 0) {
    const randomStatue: number[] = ownStatues[getRandomNum(0, ownStatues.length - 1)];
    const possibleMoves: number[][] | undefined = checkPossibleMoves.call(this, randomStatue[1], randomStatue[0]);

    if (possibleMoves === undefined || possibleMoves.length === 0) {
      break;
    }

    if (possibleMoves !== undefined && Array.isArray(possibleMoves)) {
      result = [
        randomStatue,
        possibleMoves[getRandomNum(0, possibleMoves.length - 1)],
      ];
    }
  }

  return result;
}

export { aiMove };
