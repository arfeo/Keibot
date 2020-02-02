interface App {
  pageInstance: any;
}

interface HashMap {
  [key: string]: any;
}

interface EventHandler {
  target: HTMLElement | string;
  type: string;
  listener: EventListener;
}
