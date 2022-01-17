import ToysElement from './Toys.html';
import './Toys.scss';
import getResource from '../../utils/getResource';
import { IComponent, IData, IisShow, ISettings, IShow, IYear } from '../../interfaces/interfaces';
import noUiSlider, { TargetElement } from '../../../node_modules/nouislider';
export class Toys implements IComponent {
  async render(): Promise<string> {
    return ToysElement;
  }
  async after_render(): Promise<boolean> {
    const filterSelect = document.querySelector<HTMLSelectElement>('#select-sort')!;
    const filterByShape = document.querySelector<HTMLElement>('.settings__by-shape')!;
    const filterByColor = document.querySelector<HTMLElement>('.settings__by-color')!;
    const filterByFavourite = document.querySelector<HTMLElement>('.settings__by-favourite')!;
    const filterBySize = document.querySelector<HTMLElement>('.settings__by-size')!;
    const filterByCount = document.querySelector<HTMLElement>('.settings__by-count')!;
    const filterByYear = document.querySelector<HTMLElement>('.settings__by-year')!;
    const data: Array<IData> = await getResource('../../assets/data.json');
    let choosenToys: Array<string> = [];
    let currentData: Array<IData> = [];
    const settings: ISettings = await getResource('../../assets/settings.json');
    let isShow: IisShow = {
      bySort: {
        'По названию от А до Я': false,
        'По названию от Я до А': false,
        'По возрастанию количества': false,
        'По убыванию количества': false,
      },
      byShape: {
        'колокол': false,
        'шар': false,
        'шишка': false,
        'звезда': false,
        'снежинка': false,
        'фигурка': false,
      },
      byColor: {
        'white': false,
        'yellow': false,
        'red': false,
        'blue': false,
        'green': false,
      },
      bySize: {
        'большой': false,
        'средний': false,
        'малый': false,
      },
      byFavourite: {
        'Только любимые': false,
      },
    };
    const getFromLocaleStorage = (key: string) => {
      if (
        window.localStorage.getItem(key) !== null &&
        window.localStorage.getItem(key) !== undefined &&
        window.localStorage.getItem(key) !== ''
      ) {
        return JSON.parse(window.localStorage.getItem(key)!);
      } else {
        return '';
      }
    };
    const createSettingsBySort = () => {
      const choosenSort = getFromLocaleStorage('sort');
      settings.bySort.forEach((item, index) => {
        const option = document.createElement('option') as HTMLOptionElement;
        option.textContent = item;
        option.value = item;
        filterSelect.append(option);
        if (choosenSort[item]) {
          filterSelect.options[index].selected = true;
        }
      });
    };
    createSettingsBySort();
    const createShapeSettings = (): void => {
      const choosenShape = getFromLocaleStorage('shape');
      settings.byShape.forEach((item) => {
        const shape = document.createElement('div') as HTMLElement;
        shape.classList.add('shape');
        const button = document.createElement('button') as HTMLButtonElement;
        button.classList.add('shape__btn');
        if (choosenShape[item.shape]) {
          button.classList.add('shape__btn_active');
          isShow.byShape[item.shape] = true;
        }
        button.type = 'button';
        button.style.backgroundImage = `url(${item.url})`;
        button.setAttribute('data-filter', item.shape);
        const label = document.createElement('label') as HTMLLabelElement;
        label.classList.add('shape__title');
        label.textContent = item.shape;
        shape.append(button);
        shape.append(label);
        filterByShape.querySelector<HTMLElement>('.shapes')?.append(shape);
      });
    };
    createShapeSettings();
    const createColorSettings = (): void => {
      const choosenColor = getFromLocaleStorage('color');
      settings.byColor.forEach((item) => {
        const color = document.createElement('button') as HTMLButtonElement;
        color.type = 'button';
        color.classList.add('color');
        if (choosenColor[item]) {
          color.classList.add('color_active');
          isShow.byColor[item] = true;
        }
        color.style.backgroundColor = item;
        color.setAttribute('data-filter', item);
        filterByColor.querySelector<HTMLElement>('.colors')?.append(color);
      });
    };
    createColorSettings();
    const setOutputRange = (
      before: HTMLOutputElement,
      after: HTMLOutputElement,
      range: Array<string>
    ): void => {
      before.textContent = range[0].slice(0, range[0].indexOf('.'));
      after.textContent = range[1].slice(0, range[1].indexOf('.'));
    };
    const createRange = (data: IYear, node: HTMLElement, rangeName: string): void => {
      const rangeBefore = node.querySelector('.range-before')! as HTMLOutputElement;
      rangeBefore.textContent = data.start.toString();
      const rangeAfter = node.querySelector('.range-after')! as HTMLOutputElement;
      rangeAfter.textContent = data.finish.toString();
      const range = document.getElementById(rangeName)! as TargetElement;
      const year: Array<string> = window.localStorage.getItem(rangeName)
        ? window.localStorage.getItem(rangeName)!.split(',')
        : [];
      let start;
      let finish;
      if (year.length != 0) {
        start = +year[0];
        finish = +year[1];
      } else {
        (start = data.start), (finish = data.finish);
      }
      noUiSlider.create(range, {
        range: {
          min: data.start,
          max: data.finish,
        },
        connect: true,
        direction: 'ltr',
        start: [start, finish],
        step: 1,
        orientation: 'horizontal',
        behaviour: 'tap-drag',
      });
      const rangeNumber = range.noUiSlider?.get() as Array<string>;
      setOutputRange(rangeBefore, rangeAfter, rangeNumber);
      range.noUiSlider?.on('change', () => {
        const rangeNumber = range.noUiSlider?.get() as Array<string>;
        filterCardsBy();
        setOutputRange(rangeBefore, rangeAfter, rangeNumber);
      });
    };
    createRange(settings.byCount, filterByCount, 'rangeCount');
    createRange(settings.byYear, filterByYear, 'rangeYear');
    const createCheckbox = (
      filter: Array<string>,
      option: string,
      container: string,
      node: HTMLElement
    ): void => {
      const choosenSetting = getFromLocaleStorage(option);
      filter.forEach((item, index) => {
        const wrapper = document.createElement('label') as HTMLLabelElement;
        wrapper.classList.add(option);
        const input = document.createElement('input') as HTMLInputElement;
        input.type = 'checkbox';
        input.classList.add('filled-in');
        input.id = `${option}${index}`;
        input.name = item;
        input.setAttribute('data-filter', item);
        if (choosenSetting[item]) {
          input.checked = true;
        }
        const span = document.createElement('span') as HTMLSpanElement;
        span.textContent = item;
        wrapper.append(input);
        wrapper.append(span);
        node.querySelector(container)?.append(wrapper);
      });
    };
    createCheckbox(settings.bySize, 'size', '.sizes', filterBySize);
    createCheckbox(settings.byFavourite, 'favourite', '.favourites', filterByFavourite);

    const saveToLocaleStorage = (): void => {
      window.localStorage.setItem('choosen', choosenToys.join(','));
      window.localStorage.setItem('settings', JSON.stringify(isShow));
      window.localStorage.setItem('shape', JSON.stringify(isShow.byShape));
      window.localStorage.setItem('color', JSON.stringify(isShow.byColor));
      window.localStorage.setItem('size', JSON.stringify(isShow.bySize));
      window.localStorage.setItem('sort', JSON.stringify(isShow.bySort));
      window.localStorage.setItem('favourite', JSON.stringify(isShow.byFavourite));
      const rangeYear = document.getElementById('rangeYear')! as TargetElement;
      const rangeCount = document.getElementById('rangeCount')! as TargetElement;
      let rangeNumber = rangeYear.noUiSlider?.get() as Array<number>;
      window.localStorage.setItem('rangeYear', rangeNumber.join(','));
      rangeNumber = rangeCount.noUiSlider?.get() as Array<number>;
      window.localStorage.setItem('rangeCount', rangeNumber.join(','));
    };

    const clearSettings = (): void => {
      window.localStorage.setItem('settings', '');
      window.localStorage.setItem('shape', '');
      window.localStorage.setItem('color', '');
      window.localStorage.setItem('size', '');
      window.localStorage.setItem('sort', '');
      window.localStorage.setItem('favourite', '');
    };

    const addToChoosen = (): void => {
      const allToys = document.querySelectorAll<HTMLElement>('.toy');
      const card = document.querySelector('.card-toys')!;
      allToys.forEach((toy) => {
        toy.addEventListener('click', () => {
          if (choosenToys.length <= 20) {
            toy.classList.toggle('toy_active');
            if (toy.classList.contains('toy_active')) {
              choosenToys.push(toy.dataset.num!);
              card.textContent = choosenToys.length.toString();
            } else {
              choosenToys = choosenToys.filter((item) => item != toy.dataset.num);
              card.textContent = choosenToys.length.toString();
            }
            window.localStorage.setItem('choosen', choosenToys.join(','));
          } else {
            if (toy.classList.contains('toy_active')) {
              toy.classList.remove('toy_active');
              choosenToys = choosenToys.filter((item) => item != toy.dataset.num);
              card.textContent = choosenToys.length.toString();
              window.localStorage.setItem('choosen', choosenToys.join(','));
            } else {
              alert('Извините, все слоты заполнены');
            }
          }
        });
      });
    };
    const showToysCards = (toys: Array<string>): void => {
      const allToys = document.querySelectorAll<HTMLElement>('.toy')!;
      const notFound = document.querySelector('.toys__not-found')! as HTMLElement;
      if (toys.length === 0) {
        notFound.style.display = 'block';
        allToys.forEach((toy) => toy.classList.add('toy_hide'));
      } else {
        notFound.style.display = 'none';
        allToys.forEach((toy) => {
          const toyNum: string = toy.dataset.num!;
          if (!toys.includes(toyNum)) {
            toy.classList.add('toy_hide');
          } else {
            toy.classList.remove('toy_hide');
          }
        });
      }
    };
    const createToysCards = (toys: Array<IData>): void => {
      const toysContainer = document.querySelector<HTMLElement>('.toys__inner-wrapper')!;
      const choosenToys: Array<string> = window.localStorage.getItem('choosen')
        ? window.localStorage.getItem('choosen')!.split(',')
        : [''];
      const card = document.querySelector('.card-toys')!;
      if (choosenToys[0] !== '') {
        card.textContent = choosenToys.length.toString();
      }
      toysContainer.innerHTML = '';
      toys.forEach(({ num, name, count, year, shape, color, size, favourite }) => {
        const toy = document.createElement('div') as HTMLElement;
        toy.classList.add('toy');
        if (choosenToys.includes(num)) {
          toy.classList.add('toy_active');
        }
        toy.setAttribute('data-num', num.toString());
        const title = document.createElement('h4') as HTMLElement;
        title.classList.add('toy__title');
        title.textContent = name;
        toy.append(title);
        const img = document.createElement('img') as HTMLImageElement;
        img.classList.add('toy__img');
        img.src = `../../assets/toys/${num}.png`;
        toy.append(img);

        const countToy = document.createElement('span') as HTMLSpanElement;
        countToy.classList.add('toy__count');
        countToy.textContent = `Количество: ${count}`;
        toy.append(countToy);

        const yearToy = document.createElement('span') as HTMLSpanElement;
        yearToy.classList.add('toy__year');
        yearToy.textContent = `Год покупки: ${year}`;
        toy.append(yearToy);

        const shapeToy = document.createElement('span') as HTMLSpanElement;
        shapeToy.classList.add('toy__shape');
        shapeToy.textContent = `Форма игрушки: ${shape}`;
        toy.append(shapeToy);

        const colorToy = document.createElement('span') as HTMLSpanElement;
        colorToy.classList.add('toy__color');
        colorToy.textContent = `Цвет игрушки: ${color}`;
        toy.append(colorToy);

        const sizeToy = document.createElement('span') as HTMLSpanElement;
        sizeToy.classList.add('toy__size');
        sizeToy.textContent = `Размер игрушки: ${size}`;
        toy.append(sizeToy);

        const favouriteToy = document.createElement('span') as HTMLSpanElement;
        favouriteToy.classList.add('toy__favourite');
        const like = favourite ? `да` : `нет`;
        favouriteToy.textContent = `Любимая: ${like}`;
        toy.append(favouriteToy);
        toysContainer.append(toy);
      });
      addToChoosen();
    };

    const shapeBtns = filterByShape.querySelectorAll<HTMLElement>('.shape__btn');
    shapeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('shape__btn_active');
        const shape: string = btn.dataset.filter!;
        if (btn.classList.contains('shape__btn_active')) {
          isShow.byShape[shape] = true;
        } else {
          isShow.byShape[shape] = false;
        }
        filterCardsBy();
      });
    });

    const colorBtns = filterByColor.querySelectorAll<HTMLElement>('.color');
    colorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('color_active');
        const color: string = btn.dataset.filter!;
        if (btn.classList.contains('color_active')) {
          isShow.byColor[color] = true;
        } else {
          isShow.byColor[color] = false;
        }
        filterCardsBy();
      });
    });

    const sizeCheckBox = filterBySize.querySelectorAll<HTMLElement>('.size');
    sizeCheckBox.forEach((item) => {
      item.addEventListener('change', () => {
        const checkbox = item.querySelector('input')!;
        const size: string = checkbox.dataset.filter!;
        isShow.bySize[size.toLowerCase()] = checkbox.checked;
        filterCardsBy();
      });
    });

    const favouriteCheckBox = filterByFavourite.querySelector<HTMLElement>('.favourite')!;
    favouriteCheckBox.addEventListener('change', function () {
      const checkbox = this.querySelector('input')!;
      const favourite: string = checkbox.dataset.filter!;
      isShow.byFavourite[favourite] = checkbox.checked;
      filterCardsBy();
    });
    const isAllUnchoosen = (objCheck: IShow): boolean => {
      const keys: Array<string> = Object.keys(objCheck);
      const flag: Array<boolean> = [];
      for (const key of keys) {
        flag.push(objCheck[key]);
      }
      if (flag.every((item) => item === false)) {
        return true;
      } else {
        return false;
      }
    };
    const checkItemShape = (item: IData): boolean => {
      if (isAllUnchoosen(isShow.byShape)) {
        return true;
      } else {
        return isShow.byShape[item.shape];
      }
    };
    const checkItemColor = (item: IData): boolean => {
      if (isAllUnchoosen(isShow.byColor)) {
        return true;
      } else {
        return isShow.byColor[item.color];
      }
    };
    const checkItemSize = (item: IData): boolean => {
      if (isAllUnchoosen(isShow.bySize)) {
        return true;
      } else {
        return isShow.bySize[item.size];
      }
    };
    const checkItemFavourite = (item: IData): boolean => {
      if (!isShow.byFavourite['Только любимые']) {
        return true;
      } else {
        return item.favourite;
      }
    };
    const checkItemYear = (item: IData): boolean => {
      const range = document.getElementById('rangeYear')! as TargetElement;
      const rangeNumber = range.noUiSlider?.get() as Array<number>;
      if (
        Number.parseInt(item.year) >= rangeNumber[0] &&
        Number.parseInt(item.year) <= rangeNumber[1]
      ) {
        return true;
      } else {
        return false;
      }
    };
    const checkItemCount = (item: IData): boolean => {
      const range = document.getElementById('rangeCount')! as TargetElement;
      const rangeNumber = range.noUiSlider?.get() as Array<number>;
      if (
        Number.parseInt(item.count) >= rangeNumber[0] &&
        Number.parseInt(item.count) <= rangeNumber[1]
      ) {
        return true;
      } else {
        return false;
      }
    };
    const checkItem = (item: IData): boolean => {
      return (
        checkItemShape(item) &&
        checkItemColor(item) &&
        checkItemSize(item) &&
        checkItemFavourite(item) &&
        checkItemYear(item) &&
        checkItemCount(item)
      );
    };
    const filterCardsBy = (): void => {
      const tempData: Array<IData> = data.filter((item) => checkItem(item));
      if (tempData.length === 0) {
        currentData = data;
        showToysCards(tempData.map((item) => item.num));
      } else {
        currentData = tempData;
        showToysCards(tempData.map((item) => item.num));
      }
    };

    const toggleValueBySort = (value: string): void => {
      for (const key in isShow.bySort) {
        if (key !== value) {
          isShow.bySort[key] = false;
        } else {
          isShow.bySort[key] = true;
        }
      }
    };
    const sortCards = (sortBy: string): void => {
      let sortCards: Array<IData> = [];
      switch (sortBy) {
        case 'По названию от А до Я': {
          sortCards = currentData.sort((a: IData, b: IData) => (a.name > b.name ? 1 : -1));
          toggleValueBySort('По названию от А до Я');
          break;
        }
        case 'По названию от Я до А': {
          sortCards = currentData.sort((a: IData, b: IData) => (a.name < b.name ? 1 : -1));
          toggleValueBySort('По названию от Я до А');
          break;
        }
        case 'По возрастанию количества': {
          sortCards = currentData.sort((a: IData, b: IData) => (+a.count > +b.count ? 1 : -1));
          toggleValueBySort('По возрастанию количества');
          break;
        }
        case 'По убыванию количества': {
          sortCards = currentData.sort((a: IData, b: IData) => (+a.count < +b.count ? 1 : -1));
          toggleValueBySort('По убыванию количества');
          break;
        }
      }
      createToysCards(sortCards);
    };
    filterSelect.addEventListener('change', () => {
      sortCards(filterSelect.value);
    });
    const clearStylesFromElement = (selector: string, className: string): void => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((element) => element.classList.remove(className));
    };
    const clearStylesFromCheckox = (selector: string): void => {
      const parentElement = document.querySelectorAll(selector);
      parentElement.forEach((element) => {
        element.querySelector<HTMLInputElement>('input')!.checked = false;
      });
    };
    const clearStylesFromRange = (data: IYear, node: HTMLElement, rangeName: string): void => {
      const range = document.getElementById(rangeName)! as TargetElement;
      range.noUiSlider?.set([data.start, data.finish]);
      node.querySelector<HTMLElement>('.range-before')!.textContent = data.start.toString();
      node.querySelector<HTMLElement>('.range-after')!.textContent = data.finish.toString();
    };
    const clearStylesOnFilters = (): void => {
      const keys = Object.keys(isShow);
      keys.forEach((key) => {
        switch (key) {
          case 'byColor':
            clearStylesFromElement('.color', 'color_active');
            break;
          case 'byShape':
            clearStylesFromElement('.shape__btn', 'shape__btn_active');
            break;
          case 'bySize':
            clearStylesFromCheckox('.size');
            break;
          case 'byFavourite':
            clearStylesFromCheckox('.favourite');
            break;
          case 'byCategory':
            clearStylesFromCheckox('.category');
            break;
          default:
            break;
        }
      });
      clearStylesFromRange(settings.byYear, filterByYear, 'rangeYear');
      clearStylesFromRange(settings.byCount, filterByCount, 'rangeCount');
    };

    const resetFilters = (): void => {
      const keys = Object.keys(isShow);
      keys.forEach((key) => {
        if (key !== 'bySort') {
          for (const item in isShow[key]) {
            isShow[key][item] = false;
          }
        }
      });
      clearStylesOnFilters();
      clearSettings();
      filterCardsBy();
    };

    const btnReset = document.querySelector('.btn_reset')!;
    btnReset.addEventListener('click', resetFilters);
    const btnSave = document.querySelector('.btn_save')!;
    btnSave.addEventListener('click', saveToLocaleStorage);
    window.addEventListener('beforeunload', saveToLocaleStorage);
    const initToysCards = (): void => {
      if (getFromLocaleStorage('settings') !== '') {
        isShow = getFromLocaleStorage('settings');
      }
      createToysCards(data);
      filterCardsBy();
    };
    initToysCards();
    window.addEventListener('load', initToysCards);
    const searchPanel = document.querySelector('#search-panel') as HTMLInputElement;
    searchPanel?.addEventListener('input', () => {
      const searchPanel = document.querySelector('#search-panel') as HTMLInputElement;
      const searchString = searchPanel.value;
      showToysCards(
        currentData
          .filter((item) => item.name.toLowerCase().includes(searchString))
          .map((item) => item.num)
      );
    });
    const clearSearchPanel = document.querySelector('.search__clear');
    clearSearchPanel?.addEventListener('click', () => {
      searchPanel.value = '';
      showToysCards(currentData.map((item) => item.num));
    });
    return true;
  }
}
