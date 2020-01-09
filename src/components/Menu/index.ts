import { MenuComponent } from '../core/Menu';
import { Game } from '../Game';
import { Alert } from '../common/Alert';
import { Settings } from './Settings';

import { APP } from '../../constants/game';

class Menu extends MenuComponent {
  protected helpMessage: string;

  public init(): void {
    this.appRoot = document.getElementById('root');

    this.helpMessage = (`
      There are 3 ways to win Keibot (pronounced Key-bo):

        1.  Get 3 beads in a row (horizontally, vertically, or diagonally)
        2.  Capture 3 of your opponent's statues
        3.  Place all ten of your beads on the board
      (Actually, there is a fourth way to win, but it happens very rarely — trap your 
      opponent so he can't move.)
      
      The statues move like knights in chess (an L-shaped move, two squares 
      horizontally or vertically and then one square perpendicularly).  To move a piece, 
      click on its square, then on the destination square.
      
      Place your beads by aligning yourself with your opponent, with one square 
      in between — a bead goes in that square.
      
      Capture your opponent's statues by landing on them (except for the 
      last to move — he's safe.  He's the one with a shield).
    `);

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
            this.destroy();

            APP.pageInstance = new Settings();
          },
        },
      },
      {
        type: 'button',
        value: 'Help',
        action: {
          type: 'click',
          handler: () => {
            new Alert(this, this.helpMessage, 'large');
          },
        },
      },
    ];
  }
}

export { Menu };
