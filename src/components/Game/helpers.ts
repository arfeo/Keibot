import { MAP_ITEM_TYPES } from '../../constants/game';

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
 * Returns the item type which is opponent to the given `itemType`
 *
 * @param itemType
 */
function getEnemyType(itemType: number): number {
  return itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.blue.statue : MAP_ITEM_TYPES.red.statue;
}

export {
  getCellSize,
  getMapItemsByType,
  getRandomNum,
  getEnemyType,
};
