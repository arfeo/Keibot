/**
 * Returns a random number in a given interval
 *
 * @param min
 * @param max
 */
function getRandomNum(min = 1, max = 1000): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export { getRandomNum };
