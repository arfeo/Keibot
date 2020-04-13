import { PageComponent } from '../Page';

export type ModalSize = 'large' | 'medium' | 'small';

export abstract class ModalComponent {
  protected parent: PageComponent;
  protected modalContainer: HTMLElement;
  protected mask: HTMLElement;
  protected modalWindow: HTMLElement;
  protected modalClose: HTMLElement;
  protected modal: HTMLElement;
  protected modalContent: string;
  protected eventHandlers: EventHandler[];
  public init?(...args: any[]): Promise<any> | void;
  public abstract render(): void;
  public beforeUnmount?(): void;

  protected constructor(parent: PageComponent, text?: string, size?: ModalSize, ...args: any[]) {
    this.parent = parent;
    this.eventHandlers = [];

    this.modalContainer = document.createElement('div');
    this.mask = document.createElement('div');
    this.modalWindow = document.createElement('div');
    this.modalClose = document.createElement('div');
    this.modal = document.createElement('div');

    this.modalContainer.className = 'modal-container';
    this.mask.className = 'mask';
    this.modalWindow.classList.add('modal-window');
    this.modalWindow.classList.add(size || 'medium');
    this.modalClose.className = 'modal-close';
    this.modal.className = 'modal';

    document.body.appendChild(this.modalContainer);
    this.modalContainer.appendChild(this.mask);
    this.mask.appendChild(this.modalWindow);
    this.modalWindow.appendChild(this.modalClose);
    this.modalWindow.appendChild(this.modal);

    this.modalContent = text || '';

    const { eventHandlers: parentEventHandlers } = this.parent;

    if (Array.isArray(parentEventHandlers) && parentEventHandlers.length > 0) {
      this.parent.removeEventHandlers.call(this.parent);
    }

    this.modalClose.addEventListener('click', this.destroy.bind(this));

    this.beforeMount(...args).then((): void => {
      typeof this.render === 'function' && this.render();

      if (Array.isArray(this.eventHandlers) && this.eventHandlers.length > 0) {
        this.setUpEventHandlers();
      }
    });
  }

  protected async beforeMount(...args: any[]): Promise<void> {
    typeof this.init === 'function' && await this.init(...args);

    return Promise.resolve();
  }

  private processEventHandlers(actionType: 'add' | 'remove'): void {
    if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
      return;
    }

    for (const prop of this.eventHandlers) {
      const { target, type, listener } = prop;

      const isApplicable: boolean = (
        target instanceof Element ||
        target instanceof HTMLDocument ||
        target instanceof Window
      );

      const element: HTMLElement = isApplicable ? target as HTMLElement : document.getElementById(target as string);

      if (!element) {
        break;
      }

      switch (actionType) {
        case 'add':
          element.addEventListener(type, listener);
          break;
        case 'remove':
          element.removeEventListener(type, listener);
          break;
        default:
          break;
      }
    }
  }

  private setUpEventHandlers(): void {
    this.processEventHandlers('add');
  }

  private removeEventHandlers(): void {
    this.processEventHandlers('remove');
  }

  public destroy(restoreParentHandlers = true): void {
    const { eventHandlers: parentEventHandlers } = this.parent;

    typeof this.beforeUnmount === 'function' && this.beforeUnmount();

    if (Array.isArray(this.eventHandlers) && this.eventHandlers.length > 0) {
      this.removeEventHandlers();
    }

    this.modalContainer.remove();

    if (restoreParentHandlers && Array.isArray(parentEventHandlers) && parentEventHandlers.length > 0) {
      this.parent.setUpEventHandlers.call(this.parent);
    }
  }
}
