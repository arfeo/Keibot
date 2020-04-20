function getRandomNum(min = 1, max = 1000): number {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function isObject(item: any): boolean {
  return !!item && Object.prototype.toString.call(item) === '[object Object]';
}

function isEmpty(item: any): boolean {
  return isObject(item) && Object.keys(item).length === 0;
}

function sleep(delay: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export {
  getRandomNum,
  isObject,
  isEmpty,
  sleep,
};
