import { ImageProps } from '../../../utils/types';

export interface Images {
  [key: string]: ImageProps;
}

const DEFAULT_LOOP_TIMEOUT = 4;

export abstract class PageComponent<TState = {}> {
  private loopRequestId: number;
  public appRoot: HTMLElement;
  public state: TState;
  public eventHandlers: EventHandler[];
  public images: Images;
  public loopTimeout: number;
  public animations: { [key: string]: number[] | number };
  public init?(...args: any[]): Promise<any> | void;
  public abstract render(): HTMLElement;
  public afterRender?(): void;
  public afterMount?(): void;
  public loop?(): void;
  public beforeUnmount?(): void;

  public constructor(...args: any[]) {
    this.eventHandlers = [];
    this.loopTimeout = DEFAULT_LOOP_TIMEOUT;
    this.animations = {};

    this.beforeMount(...args).then((): void => {
      this.loadImages(this.images).then((): void => {
        if (typeof this.render === 'function') {
          this.renderComponent();
        }

        typeof this.afterMount === 'function' && this.afterMount();
        typeof this.loop === 'function' && this.startLoop(() => this.loop());

        if (Array.isArray(this.eventHandlers) && this.eventHandlers.length > 0) {
          this.setUpEventHandlers();
        }
      });
    });
  }

  protected async beforeMount(...args: any[]): Promise<void> {
    typeof this.init === 'function' && await this.init(...args);

    return Promise.resolve();
  }

  private loadImages(images: Images): Promise<any[]> {
    if (images === undefined || typeof images !== 'object' || Object.keys(images).length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(Object.keys(images).map((key: string): Promise<void> => new Promise((resolve, reject): void => {
      if (images[key] === undefined) {
        return reject();
      }

      if (!(images[key].element instanceof Image)) {
        images[key].element = new Image();
      }

      images[key].element.src = images[key].src;

      images[key].element.onload = () => {
        images[key].loaded = true;

        return resolve();
      };

      images[key].element.onerror = () => {
        images[key].loaded = false;

        return resolve();
      };
    })));
  }

  private startLoop(handler: () => void): void {
    if (typeof handler !== 'function') {
      return;
    }

    let start: number = performance.now();

    const loop = (time: number): void => {
      if (time - start > this.loopTimeout) {
        handler();

        start = time;
      }

      this.loopRequestId = window.requestAnimationFrame(loop);
    };

    this.loopRequestId = window.requestAnimationFrame(loop);
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

  private renderComponent(): void {
    this.appRoot.innerHTML = '';
    this.appRoot.appendChild(this.render());

    typeof this.afterRender === 'function' && this.afterRender();
  }

  public setUpEventHandlers(): void {
    this.processEventHandlers('add');
  }

  public removeEventHandlers(): void {
    this.processEventHandlers('remove');
  }

  public setState<K extends keyof TState>(state: (Pick<TState, K> | TState | null)): void {
    this.state = {
      ...this.state,
      ...state,
    };

    if (typeof this.render === 'function' && this.shouldRerender(this.state)) {
      this.renderComponent();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public shouldRerender(state: TState): boolean {
    return true;
  }

  public destroy(): void {
    typeof this.beforeUnmount === 'function' && this.beforeUnmount();

    if (typeof this.animations === 'object' && Object.keys(this.animations).length > 0) {
      Object.keys(this.animations).forEach((key: string) => {
        const item: number[] | number = this.animations[key];

        typeof item === 'number' && window.cancelAnimationFrame(item as number);

        if (Array.isArray(item)) {
          for (const requestId of item) {
            typeof requestId === 'number' && window.cancelAnimationFrame(requestId);
          }
        }
      });
    }

    window.cancelAnimationFrame(this.loopRequestId);

    if (Array.isArray(this.eventHandlers) && this.eventHandlers.length > 0) {
      this.removeEventHandlers();
    }
  }
}
