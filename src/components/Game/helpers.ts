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
      resolve();
    };
  })));
}

export {
  setCellSize,
  waitForImagesLoad,
};
