/**
 * Function checks the ability of a statue with the given coordinates to move;
 * it returns an array of possible coordiantes or undefined if no statue found
 * on the board by the given coordinates
 *
 * @param x
 * @param y
 */
function checkAvailableMoves(x: number, y: number): number[][] | undefined {
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

export { checkAvailableMoves };
