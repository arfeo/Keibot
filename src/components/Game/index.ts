import { CELL_SIZE_VMIN } from '../../constants/game';

import { renderGameWindow } from './render';
import { setCellSize } from './helpers';

class Game {
  protected cellSize: number;
  protected boardCanvas: HTMLCanvasElement;
  protected piecesCanvas: HTMLCanvasElement;

  constructor() {
    this.cellSize = setCellSize(CELL_SIZE_VMIN);

    this.render();
  }

  public render(): void {
    renderGameWindow.call(this);
  }
}

export { Game };
