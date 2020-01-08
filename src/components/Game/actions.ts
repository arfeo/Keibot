import { renderMapItem, renderPanel } from './render';

/**
 * Function checks the ability of a statue with the given coordinates to move;
 * it returns an array of possible coordiantes or undefined if no statue found
 * on the board by the given coordinates
 *
 * @param x
 * @param y
 */
function checkPossibleMoves(x: number, y: number): number[][] | undefined {
  const itemType: number = this.boardMap[y] ? this.boardMap[y][x] : 0;

  if (itemType !== 1 && itemType !== 3) {
    return;
  }

  const enemyType: number = itemType === 1 ? 3 : 1;
  const moves: number[][] = [];

  // If the target cell is empty, return true.
  // If there's an enemy statue on the target cell -- check whether it is locked or not;
  // if it's not locked, return true, otherwise return false
  const checkCell = (targetX: number, targetY: number): boolean => {
    if (this.boardMap[targetY][targetX] === enemyType) {
      return this.lockedCell.length > 0
        ? this.lockedCell[1] !== targetX || this.lockedCell[0] !== targetY
        : true;
    }

    return this.boardMap[targetY][targetX] === 0;
  };

  if (this.boardMap[y - 2] !== undefined) {
    if (checkCell(x - 1, y - 2)) {
      moves.push([y - 2, x - 1]);
    }

    if (checkCell(x + 1, y - 2)) {
      moves.push([y - 2, x + 1]);
    }
  }

  if (this.boardMap[y + 1] !== undefined) {
    if (checkCell(x - 2, y + 1)) {
      moves.push([y + 1, x - 2]);
    }

    if (checkCell(x + 2, y + 1)) {
      moves.push([y + 1, x + 2]);
    }
  }

  if (this.boardMap[y + 2] !== undefined) {
    if (checkCell(x - 1, y + 2)) {
      moves.push([y + 2, x - 1]);
    }

    if (checkCell(x + 1, y + 2)) {
      moves.push([y + 2, x + 1]);
    }
  }

  if (this.boardMap[y - 1] !== undefined) {
    if (checkCell(x - 2, y - 1)) {
      moves.push([y - 1, x - 2]);
    }

    if (checkCell(x + 2, y - 1)) {
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
 * after placing a statue to a cell with the given coordinates
 *
 * @param x
 * @param y
 */
function checkBeadsPlacing(x: number, y: number): void {
  const itemType: number = this.boardMap[y] ? this.boardMap[y][x] : 0;

  if (itemType !== 1 && itemType !== 3) {
    return;
  }

  const ownBead: number = itemType === 1 ? 2 : 4;
  const enemyType: number = itemType === 1 ? 3 : 1;
  const playerType: string = itemType === 1 ? 'red' : 'blue';

  // If we place a bead on the game board, we should reduce `beads` count of the
  // corresponding player object. If there's no beads left, the player wins.
  // If the player got three beads in a row, he also wins.
  const placeBeads = (beadX: number, beadY: number): void => {
    if (this.players[playerType].beads === 0) {
      return;
    }

    this.boardMap[beadY][beadX] = ownBead;

    renderMapItem.call(this, beadX, beadY);

    this.players[playerType].beads -= 1;

    // No beads left -- game over
    if (this.players[playerType].beads === 0) {
      this.isGameOver = true;
    }

    // Got three beads in a row (horizontally, vertically, or diagonally) -- game over
    if (checkThreeInARow.call(this) === true) {
      this.isGameOver = true;
    }
  };

  if (this.boardMap[y - 2] !== undefined) {
    if (this.boardMap[y - 2][x - 2] === enemyType && this.boardMap[y - 1][x - 1] === 0 && !this.isGameOver) {
      placeBeads(x - 1, y - 1);
    }

    if (this.boardMap[y - 2][x] === enemyType && this.boardMap[y - 1][x] === 0 && !this.isGameOver) {
      placeBeads(x, y - 1);
    }

    if (this.boardMap[y - 2][x + 2] === enemyType && this.boardMap[y - 1][x + 1] === 0 && !this.isGameOver) {
      placeBeads(x + 1, y - 1);
    }
  }

  if (this.boardMap[y][x - 2] === enemyType && this.boardMap[y][x - 1] === 0 && !this.isGameOver) {
    placeBeads(x - 1, y);
  }

  if (this.boardMap[y][x + 2] === enemyType && this.boardMap[y][x + 1] === 0 && !this.isGameOver) {
    placeBeads(x + 1, y);
  }

  if (this.boardMap[y + 2] !== undefined) {
    if (this.boardMap[y + 2][x - 2] === enemyType && this.boardMap[y + 1][x - 1] === 0 && !this.isGameOver) {
      placeBeads(x - 1, y + 1);
    }

    if (this.boardMap[y + 2][x] === enemyType && this.boardMap[y + 1][x] === 0 && !this.isGameOver) {
      placeBeads(x, y + 1);
    }

    if (this.boardMap[y + 2][x + 2] === enemyType && this.boardMap[y + 1][x + 1] === 0 && !this.isGameOver) {
      placeBeads(x + 1, y + 1);
    }
  }
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

/**
 * Function checks whether there're three beads in a row on the game board
 * (vertically, horizontally, or diagonally)
 */
function checkThreeInARow(): boolean {
  if (!Array.isArray(this.boardMap)) {
    return false;
  }

  for (let y = 0; y < this.boardMap.length; y += 1) {
    for (let x = 0; x < this.boardMap[y].length; x += 1) {
      const item = this.boardMap[y][x];

      if (item === 2 || item === 4) {
        if (this.boardMap[y][x + 1] === item && this.boardMap[y][x + 2] === item) {
          return true;
        }

        if (
          (this.boardMap[y + 1] !== undefined && this.boardMap[y + 1][x] === item)
          && (this.boardMap[y + 2] !== undefined && this.boardMap[y + 2][x] === item)
        ) {
          return true;
        }

        if (
          (this.boardMap[y + 1] !== undefined && this.boardMap[y + 1][x + 1] === item)
          && (this.boardMap[y + 2] !== undefined && this.boardMap[y + 2][x + 2] === item)
        ) {
          return true;
        }

        if (
          (this.boardMap[y + 1] !== undefined && this.boardMap[y + 1][x - 1] === item)
          && (this.boardMap[y + 2] !== undefined && this.boardMap[y + 2][x - 2] === item)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

export {
  checkPossibleMoves,
  checkMoveToCell,
  checkBeadsPlacing,
  processGameOver,
};
