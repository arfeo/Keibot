import { MAP_ITEM_TYPES } from '../../constants/game';

/**
 * Returns the item type which is opponent to the given `itemType`
 *
 * @param itemType
 */
function getEnemyType(itemType: number): number {
  return itemType === MAP_ITEM_TYPES.red.statue ? MAP_ITEM_TYPES.blue.statue : MAP_ITEM_TYPES.red.statue;
}

/**
 * Returns player type name (`red` or `blue`) by its numeric type
 *
 * @param itemType
 */
function getPlayerTypeName(itemType: number): string {
  return itemType === MAP_ITEM_TYPES.red.statue ? 'red' : 'blue';
}

export {
  getEnemyType,
  getPlayerTypeName,
};
