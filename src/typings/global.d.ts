interface HashMap {
  [key: string]: any;
}

interface EventHandler {
  target: Window | Document | HTMLElement | string;
  type: string;
  listener: EventListener;
}

interface ImageProps {
  element: HTMLImageElement;
  src: string;
  loaded?: boolean;
}
