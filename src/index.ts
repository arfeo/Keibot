import { Game } from './components/Game';

import { APP } from './constants/game';

window.onload = (): void => {
  APP.pageInstance = new Game();
};
