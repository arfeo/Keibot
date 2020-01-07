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

export {
  checkPossibleMoves,
  checkMoveToCell,
};
