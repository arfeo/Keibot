import { renderPanel } from './panel';

function renderGameOver(lastItemType: number): void {
  this.players = {
    red: {
      ...this.players.red,
      active: false,
    },
    blue: {
      ...this.players.blue,
      active: false,
    },
  };

  this.cursor = [];

  renderPanel.call(this, lastItemType);
}

export { renderGameOver };
