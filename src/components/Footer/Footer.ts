import FooterElement from './Footer.html';
import './Footer.scss';
import { IComponent } from '../../interfaces/interfaces';
export class Footer implements IComponent {
  async render(): Promise<string> {
    return FooterElement;
  }

  async after_render(): Promise<boolean> {
    return true;
  }
}
