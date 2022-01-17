import { IComponent } from '../../interfaces/interfaces';
import HomeElement from './Home.html';
import './Home.scss';
export class Home implements IComponent {
  async render(): Promise<string> {
    return HomeElement;
  }

  async after_render(): Promise<boolean> {
    return true;
  }
}
