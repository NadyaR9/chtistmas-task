export interface IComponent {
  render(): Promise<string>;
  after_render(): Promise<boolean>;
}
interface IShape {
  shape: string;
  url: string;
}
export interface IYear {
  start: number;
  finish: number;
}
export interface ISettings {
  bySort: Array<string>;
  byCategory: Array<string>;
  byShape: Array<IShape>;
  byCount: IYear;
  byYear: IYear;
  byColor: Array<string>;
  bySize: Array<string>;
  byFavourite: Array<string>;
}

export interface IRoutes {
  [route: string]: IComponent;
}
export interface IShow {
  [index: string]: boolean;
}

export interface IisShow {
  bySort: IShow;
  byShape: IShow;
  byColor: IShow;
  bySize: IShow;
  byFavourite: IShow;
  [index: string]: IShow;
}

export interface IData {
  num: string;
  name: string;
  count: string;
  year: string;
  shape: string;
  color: string;
  size: string;
  favourite: boolean;
  [index: string]: string | boolean;
}

export interface ITreeSettings {
  [index: string]: Array<string>;
}

export interface ISaveTreeSettings {
  [index: string]: string;
}
