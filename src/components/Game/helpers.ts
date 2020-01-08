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
 * Function returns a resolved promise when all images from the given
 * images object are loaded
 *
 * @param images
 */
function waitForImagesLoad(images: { [key: string]: { element: HTMLImageElement; src: string } }): Promise<void[]> {
  if (Object.keys(images).length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(Object.keys(images).map((key: string): Promise<void> => new Promise((resolve, reject): void => {
    if (images[key] === undefined) {
      return reject();
    }

    images[key].element.src = images[key].src;

    images[key].element.onload = () => {
      return resolve();
    };
  })));
}

/**
 * Helper function which creates all game's event listeners
 */
function setUpEventHandlers(): void {
  if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
    return;
  }

  for (const prop of this.eventHandlers) {
    const { target, type, listener } = prop;
    const element: HTMLElement = target instanceof Element || target instanceof HTMLDocument
      ? target as HTMLElement
      : document.getElementById(target as string);

    if (!element) {
      break;
    }

    element.addEventListener(type, listener);
  }
}

/**
 * Helper function which removes all game's event listeners
 */
function removeEventHandlers(): void {
  if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
    return;
  }

  for (const prop of this.eventHandlers) {
    const { target, type, listener } = prop;
    const element: HTMLElement = target instanceof Element || target instanceof HTMLDocument
      ? target as HTMLElement
      : document.getElementById(target as string);

    if (!element) {
      break;
    }

    element.removeEventListener(type, listener);
  }
}

export {
  setCellSize,
  waitForImagesLoad,
  setUpEventHandlers,
  removeEventHandlers,
};
