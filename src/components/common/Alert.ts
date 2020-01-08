import { ModalComponent } from '../core/Modal';
import { PageComponent } from '../core/Page';
import { MenuComponent } from '../core/Menu';

class Alert extends ModalComponent {
  protected alertLabel: HTMLElement;
  protected alertSubmitContainer: HTMLElement;
  protected alertSubmitClose: HTMLButtonElement;

  public constructor(page: PageComponent | MenuComponent, text: string, size?: 'large' | 'medium' | 'small') {
    super(page, text, size);
  }

  public init(): void {
    this.alertLabel = document.createElement('div');
    this.alertSubmitContainer = document.createElement('div');
    this.alertSubmitClose = document.createElement('button');

    this.eventHandlers = [
      {
        target: this.alertSubmitClose,
        type: 'click',
        listener: () => this.destroy(),
      },
    ];
  }

  public render(): void {
    this.alertLabel.innerText = this.modalContent;
    this.alertSubmitContainer.className = 'modal-submit';
    this.alertSubmitClose.className = '-button';
    this.alertSubmitClose.innerText = 'Close';

    this.modal.appendChild(this.alertLabel);
    this.modal.appendChild(this.alertSubmitContainer);
    this.alertSubmitContainer.appendChild(this.alertSubmitClose);
  }
}

export { Alert };
