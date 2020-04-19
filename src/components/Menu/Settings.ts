import { MenuComponent, MenuItemOption } from './MenuComponent';
import { Menu } from './';

import { DIFFICULTY_EASY, DIFFICULTY_LEVELS } from '../../constants/game';

import { saveStorageData, getStorageData } from '../../utils/storage';

class Settings extends MenuComponent {
  protected firstMove: number | undefined;
  protected boardSize: number | undefined;
  protected difficultyLevel: number | undefined;
  protected isComputerOn: boolean | undefined;
  protected isShowMovesOn: boolean | undefined;

  public init(): void {
    this.appRoot = document.getElementById('root');
    this.firstMove = getStorageData('firstMove');
    this.boardSize = getStorageData('boardSize');
    this.difficultyLevel = getStorageData('difficultyLevel');
    this.isComputerOn = getStorageData('isComputerOn');
    this.isShowMovesOn = getStorageData('isShowMovesOn');

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
            selected: this.firstMove === 1,
          },
          {
            value: '2',
            text: 'Blue',
            selected: this.firstMove === 2 || this.firstMove === undefined,
          },
        ],
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string }}) => {
            saveStorageData('firstMove', parseInt(event.target.value, 10));
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
            selected: this.boardSize === 7,
          },
          {
            value: '8',
            text: '8x8',
            selected: this.boardSize === 8 || this.boardSize === undefined,
          },
        ],
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string }}) => {
            saveStorageData('boardSize', parseInt(event.target.value, 10));
          },
        },
      },
      {
        id: 'isComputerOn',
        type: 'checkbox',
        label: 'Computer plays (Red)',
        checked: this.isComputerOn || this.isComputerOn === undefined,
        style: 'display: flex; align-items: center',
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string; checked: boolean }}) => {
            saveStorageData('isComputerOn', event.target.checked);
          },
        },
      },
      {
        type: 'html',
        value: 'Difficulty level:',
      },
      {
        type: 'select',
        options: DIFFICULTY_LEVELS.map((level: DifficultyLevel): MenuItemOption => ({
          value: level.id.toString(),
          text: level.name,
          selected: this.difficultyLevel === level.id
            || (this.difficultyLevel === undefined && level.id === DIFFICULTY_EASY),
        })),
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string }}) => {
            saveStorageData('difficultyLevel', parseInt(event.target.value, 10));
          },
        },
      },
      {
        id: 'isShowMovesOn',
        type: 'checkbox',
        label: 'Show possible moves',
        checked: this.isShowMovesOn || this.isShowMovesOn === undefined,
        style: 'display: flex; align-items: center',
        action: {
          type: 'change',
          handler: (event: Event & { target: { value: string; checked: boolean }}) => {
            saveStorageData('isShowMovesOn', event.target.checked);
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

            new Menu();
          },
        },
      },
    ];
  }
}

export { Settings };
