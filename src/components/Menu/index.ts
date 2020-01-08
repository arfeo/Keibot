import { MenuComponent } from '../core/Menu';
import { Game } from '../Game';

import { APP } from '../../constants/game';

export class Menu extends MenuComponent {
  public init(): void {
    this.appRoot = document.getElementById('root');

    this.items = [
      {
        type: 'html',
        value: (`
          <p>Keibot</p>
          <hr />
        `),
        className: 'h1',
      },
      {
        type: 'button',
        value: 'Play',
        action: {
          type: 'click',
          handler: () => {
            this.destroy();

            APP.pageInstance = new Game();
          },
        },
      },
      {
        type: 'button',
        value: 'Settings',
        action: {
          type: 'click',
          handler: () => {
            console.log('Settings');
          },
        },
      },
      {
        type: 'button',
        value: 'Help',
        action: {
          type: 'click',
          handler: () => {
            console.log('Help');
          },
        },
      },
    ];
  }
}
