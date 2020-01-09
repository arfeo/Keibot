import { MenuComponent } from '../core/Menu';
import { Menu } from './';

import { APP } from '../../constants/game';

import { saveStorageData, getStorageData } from '../../utils/storage';

class Settings extends MenuComponent {
  protected firstMove: string;
  protected boardSize: string;

  public init(): void {
    this.appRoot = document.getElementById('root');
    this.firstMove = getStorageData('firstMove');
    this.boardSize = getStorageData('boardSize');

    this.items = [
      {
        type: 'html',
        value: 'Settings',
        className: 'h2',
      },
      {
        type: 'html',
        value: '<hr />',
      },
      {
        type: 'html',
        value: 'First to move:',
      },
      {
        type: 'select',
        options: [
          {
            value: '1',
            text: 'Red',
            selected: this.firstMove === '1' || this.firstMove === undefined,
          },
          {
            value: '2',
            text: 'Blue',
            selected: this.firstMove === '2',
          },
        ],
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string }}) => {
            saveStorageData('firstMove', event.target.value);
          },
        },
      },
      {
        type: 'html',
        value: 'Board size:',
      },
      {
        type: 'select',
        options: [
          {
            value: '7',
            text: '7x7',
            selected: this.boardSize === '7' || this.boardSize === undefined,
          },
          {
            value: '8',
            text: '8x8',
            selected: this.boardSize === '8',
          },
        ],
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string }}) => {
            saveStorageData('boardSize', event.target.value);
          },
        },
      },
      {
        type: 'html',
        value: '<hr />',
      },
      {
        type: 'button',
        value: '← Back to menu',
        action: {
          type: 'click',
          handler: () => {
            this.destroy();

            APP.pageInstance = new Menu();
          },
        },
      },
    ];
  }
}

export { Settings };
