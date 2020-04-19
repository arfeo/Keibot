interface HashMap {
  [key: string]: any;
}

interface EventHandler {
  target: Window | Document | HTMLElement | string;
  type: string;
  listener: EventListener;
}

interface MapItemProps {
  statue: number;
  bead: number;
}

interface DifficultyLevel {
  id: number;
  name: string;
  depth: number;
}
