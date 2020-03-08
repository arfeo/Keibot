export interface Images {
  [key: string]: {
    element: HTMLImageElement;
    src: string;
  };
}

export abstract class PageComponent {
  public eventHandlers: EventHandler[];
  public images: Images;
  public init?(...args: any[]): Promise<any> | void;
  public abstract render(): void;
  public beforeUnmount?(): void;

  public constructor(...args: any[]) {
    this.eventHandlers = [];

    this.beforeMount(...args).then((): void => {
      this.loadImages(this.images).then((): void => {
        typeof this.render === 'function' && this.render();

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

  private loadImages(images: Images): Promise<void[]> {
    if (images === undefined || typeof images !== 'object' || Object.keys(images).length === 0) {
      return Promise.resolve([]);
    }

    return Promise.all(Object.keys(images).map((key: string): Promise<void> => new Promise((resolve, reject): void => {
      if (images[key] === undefined) {
        return reject();
      }

      images[key].element.src = images[key].src;

      images[key].element.onload = () => {
        return resolve();
      };
    })));
  }

  private processEventHandlers(actionType: 'add' | 'remove'): void {
    if (!Array.isArray(this.eventHandlers) || this.eventHandlers.length === 0) {
      return;
    }

    for (const prop of this.eventHandlers) {
      const { target, type, listener } = prop;
      const element: HTMLElement = target instanceof Element || target as any instanceof HTMLDocument
        ? target as HTMLElement
        : document.getElementById(target as string);

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

  public setUpEventHandlers(): void {
    this.processEventHandlers('add');
  }

  public removeEventHandlers(): void {
    this.processEventHandlers('remove');
  }

  public destroy(): void {
    typeof this.beforeUnmount === 'function' && this.beforeUnmount();

    if (Array.isArray(this.eventHandlers) && this.eventHandlers.length > 0) {
      this.removeEventHandlers();
    }
  }
}
