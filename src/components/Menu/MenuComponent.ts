import { PageComponent } from '../../core/components';

export interface MenuItem {
  id?: string;
  type: 'button' | 'checkbox' | 'html' | 'password' | 'radio' | 'select' | 'text';
  name?: string;
  className?: string;
  value?: string;
  label?: string;
  placeholder?: string;
  checked?: boolean;
  autocomplete?: string;
  options?: MenuItemOption[];
  action?: MenuItemAction;
  style?: string;
}

export interface MenuItemOption {
  value: string;
  text: string;
  label?: string;
  selected?: boolean;
}

export interface MenuItemAction {
  type: string;
  handler: EventListener;
}

export abstract class MenuComponent extends PageComponent {
  public items: MenuItem[];
  public isClosable: boolean;
  public onClose?(): void;

  private static processElementProps(
    element: Partial<HTMLInputElement>,
    menuItem: { [key: string]: any },
    props: string[],
  ): Partial<HTMLInputElement> {
    const elementCopy: Partial<HTMLInputElement> & { [key: string]: any } = element;

    for (const prop of props) {
      if (menuItem[prop]) {
        elementCopy[prop] = menuItem[prop];
      }
    }

    return elementCopy;
  }

  protected async beforeMount(...args: any[]): Promise<void> {
    this.eventHandlers = [];
    this.items = [];

    typeof this.init === 'function' && await this.init(...args);

    return Promise.resolve();
  }

  public render(): HTMLElement {
    const menuContainer: HTMLElement = document.createElement('div');

    if (this.isClosable) {
      const menuClose: HTMLElement = document.createElement('div');

      menuClose.className = 'menu-close';

      menuContainer.appendChild(menuClose);

      this.eventHandlers.push(
        {
          target: menuClose,
          type: 'click',
          listener: () => {
            typeof this.onClose === 'function' && this.onClose();
          },
        },
        {
          target: window,
          type: 'keydown',
          listener: (e: KeyboardEvent) => {
            typeof this.onClose === 'function' && e && e.key === 'Escape' && this.onClose();
          },
        },
      );
    }

    menuContainer.className = 'menu-container';

    Array.isArray(this.items) && this.items.map((item: MenuItem) => {
      const menuItem: HTMLElement = document.createElement('div');
      let menuElement: Partial<HTMLInputElement>;
      let elementLabel: HTMLLabelElement;

      menuItem.className = 'menu-item';

      if (item.style) {
        menuItem.style.cssText = item.style;
      }

      menuContainer.appendChild(menuItem);

      // TODO: radio groups
      switch (item.type) {
        case 'button':
        case 'text':
        case 'password': {
          const props: string[] = item.type !== 'button'
            ? ['type', 'name', 'value', 'placeholder', 'autocomplete']
            : ['type', 'name', 'value'];

          menuElement = document.createElement('input');
          menuElement = MenuComponent.processElementProps(menuElement, item, props);
          break;
        }
        case 'checkbox':
        case 'radio': {
          menuElement = document.createElement('input');
          menuElement = MenuComponent.processElementProps(menuElement, item, ['type', 'name', 'checked']);

          elementLabel = document.createElement('label');
          elementLabel.htmlFor = item.id;
          elementLabel.innerHTML = item.label || '';
          break;
        }
        case 'select': {
          menuElement = document.createElement('select');

          for (const opt of item.options) {
            const option: HTMLOptionElement = document.createElement('option');

            option.value = opt.value;
            option.text = opt.text;
            option.selected = opt.selected || false;

            menuElement = MenuComponent.processElementProps(menuElement, item, ['label']);
            menuElement.appendChild(option);
          }
          break;
        }
        case 'html': {
          menuElement = document.createElement('div');
          menuElement = MenuComponent.processElementProps(menuElement, item, ['value']);
          menuElement.innerHTML = item.value || '';
          break;
        }
        default: break;
      }

      menuElement = MenuComponent.processElementProps(menuElement, item, ['id', 'className']);

      menuItem.appendChild(menuElement as Node);

      if (elementLabel) {
        menuItem.appendChild(elementLabel);
      }

      if (item.action) {
        this.eventHandlers.push({
          target: menuElement as HTMLElement,
          type: item.action.type,
          listener: item.action.handler,
        });
      }
    });

    return menuContainer;
  }
}
