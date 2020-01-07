/**
 * Function creates all game's event listeners
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
 * Function removes all game's event listeners
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

/**
 * Function fires on the items canvas click event
 *
 * @param event
 */
function onBoardClick(event: MouseEvent): void {
  const ctx: CanvasRenderingContext2D = this.cursorCanvas.getContext('2d');
  const actualCellSize: number = this.cursorCanvas.getBoundingClientRect().width / 8;
  const x: number = Math.trunc(event.offsetX / actualCellSize);
  const y: number = Math.trunc(event.offsetY / actualCellSize);

  ctx.clearRect(0, 0, this.cellSize * 8, this.cellSize * 8);

  // Remove cursor if click the already selected item
  this.cursor = Array.isArray(this.cursor) && this.cursor.length > 0 && this.cursor[0] === x && this.cursor[1] === y
    ? []
    : [x, y];
}

export {
  setUpEventHandlers,
  removeEventHandlers,
  onBoardClick,
};
