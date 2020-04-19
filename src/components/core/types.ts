export interface Images {
  [key: string]: ImageProps;
}

export type ModalSize = 'large' | 'medium' | 'small';

export interface ModalOptions {
  className?: string;
  size?: ModalSize;
}
