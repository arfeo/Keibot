import { ModalComponent, PageComponent } from '../../core/components';
import { MenuComponent } from './MenuComponent';

class Help extends ModalComponent {
  public constructor(page: PageComponent | MenuComponent) {
    super(page, { size: 'large' });
  }

  public init(): void {
    this.eventHandlers = [
      {
        target: window,
        type: 'keydown',
        listener: (e: KeyboardEvent) => {
          if (e && e.key === 'Escape') {
            this.destroy();
          }
        },
      },
    ];
  }

  public render(): HTMLElement {
    const labelText = document.createElement('div');

    labelText.innerText = (
      `There are 3 ways to win Keibot (pronounced Key-bo):

      1.  Get 3 beads in a row (horizontally, vertically, or diagonally)
      2.  Capture 3 of your opponent's statues
      3.  Place all ten of your beads on the board
      (Actually, there is a fourth way to win, but it happens very rarely — trap your 
      opponent so he can't move.)
      
      The statues move like knights in chess (an L-shaped move, two squares 
      horizontally or vertically and then one square perpendicularly). To move a piece, 
      click on its square, then on the destination square.
      
      Place your beads by aligning yourself with your opponent, with one square 
      in between — a bead goes in that square.
      
      Capture your opponent's statues by landing on them (except for the 
      last to move — he's safe.  He's the one with a shield).
      
      On normal and hard levels, four idle rounds (without either a capture
      or bead placement) result in a draw.
      
      On hard level, the first statue to move can't move on the second round.`
    );

    return labelText;
  }
}

export { Help };
