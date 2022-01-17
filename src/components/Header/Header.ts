import { IComponent } from '../../interfaces/interfaces';
import HeaderElement from './Header.html';
import './Header.scss';
export class Header implements IComponent {
  async render(): Promise<string> {
    return HeaderElement;
  }

  async after_render(): Promise<boolean> {
    return true;
  }
}
