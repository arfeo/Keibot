import { renderGrid } from './grid';
import { renderMap } from './map';
import { renderPanel } from './panel';

function renderGameWindow(): HTMLElement {
  const gameWindow: HTMLElement = document.createElement('div');
  const boardGrid: HTMLElement = document.createElement('div');
  const boardPanel: HTMLElement = document.createElement('div');
  const panelButtons: HTMLElement = document.createElement('div');
  const canvasSize: number = this.cellSize * this.boardSize;

  gameWindow.className = 'gameWindow';
  boardGrid.className = 'boardGrid';
  boardPanel.className = 'boardPanel';
  this.boardCanvas.className = '-board-canvas';
  this.itemCanvas.className = '-item-canvas';
  this.cursorCanvas.className = '-cursor-canvas';
  this.panelCanvas.className = '-panel-canvas';
  panelButtons.className = '-panel-buttons';
  this.newGameButton.className = '-button';
  this.backToMenuButton.className = '-button';

  this.boardCanvas.width = this.itemCanvas.width = this.cursorCanvas.width = canvasSize;
  this.boardCanvas.height = this.itemCanvas.height = this.cursorCanvas.height = canvasSize;
  this.panelCanvas.width = this.cellSize * 4;
  this.panelCanvas.height = this.cellSize * 7;

  this.newGameButton.innerText = 'New game';
  this.backToMenuButton.innerText = 'Back to menu';

  gameWindow.appendChild(boardGrid);
  boardGrid.appendChild(this.boardCanvas);
  boardGrid.appendChild(this.itemCanvas);
  boardGrid.appendChild(this.cursorCanvas);
  gameWindow.appendChild(boardPanel);
  boardPanel.appendChild(this.panelCanvas);
  boardPanel.appendChild(panelButtons);
  panelButtons.appendChild(this.newGameButton);
  panelButtons.appendChild(this.backToMenuButton);

  renderGrid.call(this);
  renderMap.call(this);
  renderPanel.call(this);

  return gameWindow;
}

export { renderGameWindow };
