/**
 * Function returns the cell size (atomic canvas measure)
 * depending on the screen size and the given vmin value
 */
function getCellSize(vmin: number): number {
  const vpWidth: number = window.innerWidth;
  const vpHeight: number = window.innerHeight;
  const vMin: number = vpWidth >= vpHeight ? (vpHeight / 100) : (vpWidth / 100);

  return Math.round(vMin * vmin  / 10) * 10;
}

/**
 * Function returns an array of items' coordinates for the given board map
 * according to the given item type; if the given map is undefined or not an array,
 * function returns an empty array
 *
 * @param map
 * @param type
 */
function getMapItemsByType(map: number[][], type: number): number[][] {
  const result: number[][] = [];

  if (!map || !Array.isArray(map)) {
    return result;
  }

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      if (map[y][x] === type) {
        result.push([y, x]);
      }
    }
  }

  return result;
}

/**
 * Immutably changes the board map value
 *
 * @param boardMap
 * @param x
 * @param y
 * @param value
 */
function changeMapValue(boardMap: number[][], x: number, y: number, value: number): number[][] {
  return boardMap.map((row: number[], rowIndex: number) => row.map((column: number, columnIndex: number) => {
    return rowIndex === y && columnIndex === x ? value : boardMap[rowIndex][columnIndex];
  }));
}

export {
  getCellSize,
  getMapItemsByType,
  changeMapValue,
};
