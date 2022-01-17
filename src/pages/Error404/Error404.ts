import { IComponent } from '../../interfaces/interfaces';

export class Error404 implements IComponent {
  async render() {
    return 'Error404Element';
  }

  async after_render(): Promise<boolean> {
    return true;
  }
}
