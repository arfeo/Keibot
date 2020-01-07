import { renderMapItem } from './render';

/**
 * Function checks the ability of a statue with the given coordinates to move;
 * it returns an array of possible coordiantes or undefined if no statue found
 * on the board by the given coordinates
 *
 * @param x
 * @param y
 */
function checkPossibleMoves(x: number, y: number): number[][] | undefined {
  if (this.boardMap[y] === undefined || !(this.boardMap[y][x] === 1 || this.boardMap[y][x] === 3)) {
    return undefined;
  }

  const moves: number[][] = [];

  if (this.boardMap[y - 2] !== undefined) {
    if (this.boardMap[y - 2][x - 1] === 0) {
      moves.push([y - 2, x - 1]);
    }

    if (this.boardMap[y - 2][x + 1] === 0) {
      moves.push([y - 2, x + 1]);
    }
  }

  if (this.boardMap[y + 1] !== undefined) {
    if (this.boardMap[y + 1][x - 2] === 0) {
      moves.push([y + 1, x - 2]);
    }

    if (this.boardMap[y + 1][x + 2] === 0) {
      moves.push([y + 1, x + 2]);
    }
  }

  if (this.boardMap[y + 2] !== undefined) {
    if (this.boardMap[y + 2][x - 1] === 0) {
      moves.push([y + 2, x - 1]);
    }

    if (this.boardMap[y + 2][x + 1] === 0) {
      moves.push([y + 2, x + 1]);
    }
  }

  if (this.boardMap[y - 1] !== undefined) {
    if (this.boardMap[y - 1][x - 2] === 0) {
      moves.push([y - 1, x - 2]);
    }

    if (this.boardMap[y - 1][x + 2] === 0) {
      moves.push([y - 1, x + 2]);
    }
  }

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
 * Function checks whether new neads are needed to be placed on the board or not
 */
function checkBeadsPlacing(x: number, y: number): void {
  const itemType: number = this.boardMap[y][x];

  if (itemType !== 1 && itemType !== 3) {
    return;
  }

  const ownBead: number = itemType === 1 ? 2 : 4;
  const enemyType: number = itemType === 1 ? 3 : 1;

  const reduceBeads = (beadX: number, beadY: number): void => {
    const playerType: string = itemType === 1 ? 'red' : 'blue';

    this.boardMap[beadY][beadX] = ownBead;

    renderMapItem.call(this, beadX, beadY);

    this.players[playerType].beads -= 1;

    if (this.players[playerType].beads === 0) {
      // TODO: GAME OVER: make it louder!
      console.log(itemType === 1 ? 'You lost!' : 'You win!');
    }
  };

  if (this.boardMap[y - 2] !== undefined) {
    if (this.boardMap[y - 2][x - 2] === enemyType && this.boardMap[y - 1][x - 1] === 0) {
      reduceBeads(x - 1, y - 1);
    }

    if (this.boardMap[y - 2][x] === enemyType && this.boardMap[y - 1][x] === 0) {
      reduceBeads(x, y - 1);
    }

    if (this.boardMap[y - 2][x + 2] === enemyType && this.boardMap[y - 1][x + 1] === 0) {
      reduceBeads(x + 1, y - 1);
    }
  }

  if (this.boardMap[y][x - 2] === enemyType && this.boardMap[y][x - 1] === 0) {
    reduceBeads(x - 1, y);
  }

  if (this.boardMap[y][x + 2] === enemyType && this.boardMap[y][x + 1] === 0) {
    reduceBeads(x + 1, y);
  }

  if (this.boardMap[y + 2] !== undefined) {
    if (this.boardMap[y + 2][x - 2] === enemyType && this.boardMap[y + 1][x - 1] === 0) {
      reduceBeads(x - 1, y + 1);
    }

    if (this.boardMap[y + 2][x] === enemyType && this.boardMap[y + 1][x] === 0) {
      reduceBeads(x, y + 1);
    }

    if (this.boardMap[y + 2][x + 2] === enemyType && this.boardMap[y + 1][x + 1] === 0) {
      reduceBeads(x + 1, y + 1);
    }
  }
}

export {
  checkPossibleMoves,
  checkMoveToCell,
  checkBeadsPlacing,
};
