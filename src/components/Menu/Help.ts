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

    labelText.innerHTML = (`
      <div>There are 3 ways to win <strong>Keibot</strong> (pronounced <em>Key-bo</em>):</div>

      <ol>
        <li>Get 3 beads in a row (horizontally, vertically, or diagonally)</li>
        <li>Capture 3 of your opponent's statues</li>
        <li>Place all ten of your beads on the board</li>
      </ol>
      
      <p>(Actually, there is a fourth way to win, but it happens very rarely—trap your 
      opponent so he can't move.)</p>
      
      <p>The statues move like knights in chess (an L-shaped move, two squares 
      horizontally or vertically and then one square perpendicularly). To move a piece, 
      click on its square, then on the destination square.</p>
      
      <p>Place your beads by aligning yourself with your opponent, with one square 
      in between—a bead goes in that square.</p>
      
      <p>Capture your opponent's statues by landing on them (except for the 
      last to move—he's safe.  He's the one with a shield).</p>
      
      <p>On normal and hard levels, four idle rounds (without either a capture
      or bead placement) result in a draw.</p>
      
      <div>On hard level, the first statue to move can't move on the second round.</div>
    `);

    return labelText;
  }
}

export { Help };
