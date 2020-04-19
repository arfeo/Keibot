import { MenuComponent } from './MenuComponent';
import { Game } from '../Game';
import { Help } from './Help';
import { Settings } from './Settings';

class Menu extends MenuComponent {
  public init(): void {
    this.appRoot = document.getElementById('root');

    this.items = [
      {
        type: 'html',
        value: 'Keibot',
        className: 'h1',
      },
      {
        type: 'html',
        value: '<hr />',
      },
      {
        type: 'button',
        value: 'Play',
        action: {
          type: 'click',
          handler: () => {
            this.destroy();

            new Game();
          },
        },
      },
      {
        type: 'button',
        value: 'Settings',
        action: {
          type: 'click',
          handler: () => {
            this.destroy();

            new Settings();
          },
        },
      },
      {
        type: 'button',
        value: 'Help',
        action: {
          type: 'click',
          handler: () => new Help(this),
        },
      },
    ];
  }
}

export { Menu };
