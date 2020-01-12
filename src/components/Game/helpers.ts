import { MAP_ITEM_TYPES } from '../../constants/game';

/**
 * Local helper function.
 * Calculates the analogue of CSS vmin in pixels
 */
function calculateVMin(): number {
  const vpWidth: number = window.innerWidth;
  const vpHeight: number = window.innerHeight;

  return vpWidth >= vpHeight ? (vpHeight / 100) : (vpWidth / 100);
}

/**
 * Function returns the cell size (atomic canvas measure)
 * depending on the screen size and the given vmin value
 */
function setCellSize(vmin: number): number {
  return Math.round(calculateVMin() * vmin  / 10) * 10;
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
 * Returns a random number in a given interval; as an option it discards one or more numbers given
 * in the `discard` array
 *
 * @param min
 * @param max
 * @param discard
 */
function getRandomNum(min = 1, max = 1000, discard: number[] = []): number {
  const num: number = Math.floor(min + Math.random() * (max + 1 - min));

  if (discard.indexOf(num) > -1) {
    return getRandomNum(min, max, discard);
  }

  return num;
}

/**
 * Function checks whether there're three beads in a row on the game board
 * (vertically, horizontally, or diagonally)
 *
 * @param map
 */
function isThreeInARow(map: number[][]): boolean {
  if (!map || !Array.isArray(map)) {
    return false;
  }

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[y].length; x += 1) {
      const item = map[y][x];

      if (item === MAP_ITEM_TYPES.red.bead || item === MAP_ITEM_TYPES.blue.bead) {
        if (map[y][x + 1] === item && map[y][x + 2] === item) {
          return true;
        }

        if (
          (map[y + 1] !== undefined && map[y + 1][x] === item)
          && (map[y + 2] !== undefined && map[y + 2][x] === item)
        ) {
          return true;
        }

        if (
          (map[y + 1] !== undefined && map[y + 1][x + 1] === item)
          && (map[y + 2] !== undefined && map[y + 2][x + 2] === item)
        ) {
          return true;
        }

        if (
          (map[y + 1] !== undefined && map[y + 1][x - 1] === item)
          && (map[y + 2] !== undefined && map[y + 2][x - 2] === item)
        ) {
          return true;
        }
      }
    }
  }

  return false;
}

export {
  getMapItemsByType,
  getRandomNum,
  setCellSize,
  isThreeInARow,
};
