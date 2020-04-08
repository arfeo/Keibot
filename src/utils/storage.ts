import { STORAGE_PREFIX } from '../constants/game';

function getStorageData(keys?: string[] | string, onError?: (error: string) => void): any[] | any | undefined {
  try {
    const data: any = JSON.parse(window.localStorage.getItem(`${STORAGE_PREFIX}`));

    if (keys === undefined) {
      return data || {};
    }

    if (data && Object.prototype.toString.call(data) === '[object Object]') {
      if (Array.isArray(keys)) {
        return keys.map((key: string) => data[key]);
      }

      return data[keys];
    }

    return Array.isArray(keys) ? [] : undefined;
  } catch (error) {
    if (typeof onError === 'function') {
      onError(error);
    }
  }
}

function saveStorageData(key: string, data: any, onError?: (error: string) => void): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}`, JSON.stringify({
      ...getStorageData(),
      [key]: data,
    }));
  } catch (error) {
    if (typeof onError === 'function') {
      onError(error);
    }
  }
}

export {
  getStorageData,
  saveStorageData,
};
