import FirsElement from './Firs.html';
import './Firs.scss';
import { IComponent, IData, ISaveTreeSettings, ITreeSettings } from '../../interfaces/interfaces';
import getResource from '../../utils/getResource';

export class Firs implements IComponent {
  async render(): Promise<string> {
    return FirsElement;
  }

  async after_render(): Promise<boolean> {
    const treeSettings: ITreeSettings = await getResource('../../assets/tree-settings.json');
    const data: Array<IData> = await getResource('../../assets/data.json');
    let interval: ReturnType<typeof setInterval>;
    const audio: HTMLAudioElement = document.createElement('audio');
    document.body.append(audio);
    audio.src = './assets/audio/audio.mp3';
    document.body.addEventListener('click', function () {
      setMusic(saveSettings.music);
    });
    let saveSettings: ISaveTreeSettings = {
      tree: './assets/tree/1.png',
      bg: './assets/bg/1.jpg',
      color: '',
      music: '',
      snowflake: '',
    };
    const createSetting = (item: string, className: string, container: HTMLElement) => {
      const element = document.createElement('div');
      const img = document.createElement('img');
      element.classList.add(className);
      element.dataset.src = item;
      img.src = item;
      element.append(img);
      container?.append(element);
    };
    const createTrees = (trees: Array<string>, parentNode: HTMLElement): void => {
      const container: HTMLElement = parentNode.querySelector('.trees')!;
      trees.forEach((item) => createSetting(item, 'trees__item', container));
    };
    const createBackground = (bg: Array<string>): void => {
      const container: HTMLElement = document.querySelector('.bg')!;
      bg.forEach((item) => createSetting(item, 'bg__item', container));
    };
    const createLights = (lights: Array<string>) => {
      const container: HTMLElement = document.querySelector('.lights')!;
      lights.forEach((item) => {
        const element = document.createElement('button');
        element.type = 'button';
        element.classList.add('lights__item', item);
        element.dataset.color = item;
        container.append(element);
      });
    };
    const createFavToy = (item: IData, container: HTMLElement) => {
      const toy = document.createElement('div');
      toy.classList.add('fav-toys__item');
      toy.dataset.num = item.num;
      toy.id = `toy${item.num}`;

      for (let i = 0; i < +item.count; i++) {
        const img = document.createElement('img');
        img.src = `./assets/toys/${item.num}.png`;
        img.classList.add('toy-img');
        img.draggable = true;
        img.id = `${item.num}-${i + 1}`;
        toy.append(img);
      }
      const count = document.createElement('div');
      count.classList.add('fav-toys__item-count');
      count.textContent = item.count;
      toy.append(count);
      container.append(toy);
    };
    const createFavToys = (data: Array<IData>): void => {
      const tempFromLocalStorage = window.localStorage.getItem('choosen');
      let numFavToys: Array<string>;
      if (tempFromLocalStorage === undefined || tempFromLocalStorage === null) {
        numFavToys = [''];
      } else {
        numFavToys = tempFromLocalStorage.split(',');
      }
      const container: HTMLElement = document.querySelector('.fav-toys__wrapper')!;
      if (numFavToys[0] === '') {
        for (let i = 0; i < 20; i++) {
          createFavToy(data[i], container);
        }
      } else {
        data.forEach((item) => {
          if (numFavToys.includes(item.num)) {
            createFavToy(item, container);
          }
        });
      }
    };
    const setBackground = (pathToBackground: string): void => {
      const workspace = document.querySelector('.workspace')! as HTMLElement;
      saveSettings.bg = pathToBackground;
      workspace.style.backgroundImage = `url(${pathToBackground})`;
    };
    const setTree = (pathToTree: string): void => {
      const img = document.querySelector('.workspace__tree')! as HTMLImageElement;
      saveSettings.tree = pathToTree;
      img.src = pathToTree;
      img.useMap = '#image-map';
    };
    const setTreeEvents = (treeItems: NodeListOf<HTMLElement>): void => {
      treeItems.forEach((item) => {
        item.addEventListener('click', () => {
          const pathToTree = item.dataset.src ? item.dataset.src : '';
          setTree(pathToTree);
        });
      });
    };
    const setBgEvents = (bgItems: NodeListOf<HTMLElement>): void => {
      bgItems.forEach((item) => {
        item.addEventListener('click', () => {
          const pathToBackground = item.dataset.src ? item.dataset.src : '';
          setBackground(pathToBackground);
        });
      });
    };

    const setLightsBtn = (colorOfLight: string): void => {
      const lights = document.querySelectorAll<HTMLElement>('.lights__item');
      lights.forEach((item) => {
        if (item.dataset.color === colorOfLight) {
          item.classList.add('lights__item_active');
        }
      });
    };
    const createGarlands = (colorOfLight: string): void => {
      const container = document.querySelector('.workspace__lights-wrapper')! as HTMLElement;
      container.innerHTML = '';
      if (colorOfLight !== '') {
        for (let i = 1; i <= 8; i++) {
          const listOfLights = document.createElement('ul');
          listOfLights.classList.add('lightrope');
          listOfLights.style.width = `${i}5%`;
          listOfLights.style.height = `auto`;
          for (let l = 1; l <= i * 3; l++) {
            const itemLight = document.createElement('li');
            itemLight.classList.add(`lightrope__${colorOfLight}`);
            listOfLights.append(itemLight);
          }
          container?.append(listOfLights);
        }
      }
    };

    const onLightsClear = (lights: NodeListOf<HTMLElement>, currentIndex = 100): void => {
      lights.forEach((item, index) => {
        if (currentIndex !== index) {
          item.classList.remove('lights__item_active');
          createGarlands('');
        }
      });
    };
    const createSnowFlake = (): void => {
      const workspace = document.querySelector('.workspace__snow')!;
      const snow_flake = document.createElement('i');
      snow_flake.classList.add('fas');
      snow_flake.classList.add('fa-snowflake');
      snow_flake.style.left = Math.random() * window.innerWidth + 'px';
      snow_flake.style.animationDuration = Math.random() * 3 + 2 + 's';
      snow_flake.style.opacity = (Math.floor(Math.random() * (1 - 0.7 + 1)) + 0.7).toString();
      snow_flake.style.fontSize = Math.random() * 10 + 20 + 'px';
      snow_flake.style.zIndex = '100';
      workspace.appendChild(snow_flake);
      setTimeout(() => {
        snow_flake.remove();
      }, 5000);
    }

    const onSetSnow = (): void => {
      const snowControl = document.querySelector('.control__snow')!;
      snowControl.addEventListener('click', () => {
        if (snowControl.classList.contains('control__snow_active')) {
          snowControl.classList.remove('control__snow_active');
          saveSettings.snowflake = 'false';
          clearInterval(interval);
        } else {
          snowControl.classList.add('control__snow_active');
          saveSettings.snowflake = 'true';
          interval = setInterval(createSnowFlake, 50);
        }
      });
    };
    const setSnow = (snowflake: string): void => {
      if (snowflake === 'true') {
        interval = setInterval(createSnowFlake, 50);
        document.querySelector('.control__snow')!.classList.add('control__snow_active');
      } else {
        clearInterval(interval);
        document.querySelector('.control__snow')!.classList.remove('control__snow_active');
      }
    };
    const setMusic = (music: string): void => {
      if (music === 'true') {
        document.querySelector('.control__audio')!.classList.add('control__audio_active');
        audio.play();
      } else {
        document.querySelector('.control__audio')!.classList.remove('control__audio_active');
        audio.pause();
      }
    };
    const onSetMusic = (): void => {
      const audioControl = document.querySelector('.control__audio')!;
      audioControl.addEventListener('click', () => {
        if (audioControl.classList.contains('control__audio_active')) {
          audioControl.classList.remove('control__audio_active');
          saveSettings.music = 'false';
        } else {
          audioControl.classList.add('control__audio_active');
          saveSettings.music = 'true';
        }
        console.log(saveSettings.music);
        setMusic(saveSettings.music);
      });
    };
    const onLights = (lightsBtns: NodeListOf<HTMLElement>): void => {
      lightsBtns.forEach((item, index) =>
        item.addEventListener('click', () => {
          if (item.classList.contains('lights__item_active')) {
            item.classList.remove('lights__item_active');
            createGarlands('');
          } else {
            item.classList.add('lights__item_active');
            saveSettings.color = item.dataset.color!;
            onLightsClear(lightsBtns, index);
            const colorOfLight = item.dataset.color!;
            createGarlands(colorOfLight);
          }
        })
      );
    };
    const setSettings = (): void => {
      setBackground(saveSettings.bg);
      setTree(saveSettings.tree);
      setLightsBtn(saveSettings.color);
      createGarlands(saveSettings.color);
      setSnow(saveSettings.snowflake);
      setMusic(saveSettings.music);
    };
    const initElements = (): void => {
      const tempSettings = window.localStorage.getItem('treeSettings');
      if (tempSettings !== '' && tempSettings !== undefined && tempSettings !== null) {
        saveSettings = JSON.parse(tempSettings);
      }
      const treesUndress: HTMLElement = document.querySelector('.firs__settings-trees')!;
      const treesDressup: HTMLElement = document.querySelector('.firs__fav-dressup')!;
      createTrees(treeSettings.trees, treesUndress);
      createTrees(treeSettings.trees, treesDressup);
      createBackground(treeSettings.bg);
      createLights(treeSettings.lights);
      const bgItems = document.querySelectorAll<HTMLElement>('.bg__item');
      const treeItems = document
        .querySelector('.firs__settings-trees')!
        .querySelectorAll<HTMLElement>('.trees__item')!;
      const lightsBtns = document.querySelectorAll<HTMLElement>('.lights__item')!;
      setBgEvents(bgItems);
      setTreeEvents(treeItems);
      onLights(lightsBtns);
      createFavToys(data);
      onSetSnow();
      onSetMusic();
      setSettings();
    };
    initElements();

    const onSaveSettings = (): void => {
      console.log('settings', saveSettings);
      window.localStorage.setItem('treeSettings', JSON.stringify(saveSettings));
    };
    const onResetSettings = (): void => {
      window.localStorage.setItem('treeSettings', '');
      onLightsClear(document.querySelectorAll<HTMLElement>('.lights__item')!);
      saveSettings.bg = './assets/bg/1.jpg';
      saveSettings.tree = './assets/tree/1.png';
      saveSettings.music = 'false';
      saveSettings.snowflake = 'false';
      setBackground(saveSettings.bg);
      setTree(saveSettings.tree);
      setMusic(saveSettings.music);
      setSnow(saveSettings.snowflake);
    };
    const btnSaveSettings = document.querySelector('.btn_save')!;
    btnSaveSettings.addEventListener('click', onSaveSettings);
    const btnResetSettings = document.querySelector('.btn_reset')!;
    btnResetSettings.addEventListener('click', onResetSettings);

    const toysContainer: HTMLElement = document.querySelector('.fav-toys__wrapper')!;
    const map: HTMLElement = document.querySelector('area')!;
    const handlerDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    map.addEventListener('dragover', (e) => handlerDragOver(e as DragEvent));
    toysContainer.addEventListener('dragover', (e) => handlerDragOver(e as DragEvent));
    map.addEventListener('drop', (e) => handlerDropTree(e as DragEvent));
    toysContainer.addEventListener('drop', (e) => handlerDropToyContainer(e as DragEvent));
    const setCountToy = (parentId: string): void => {
      const parent = document.querySelector(`#toy${parentId}`)!;
      const countElement = parent.querySelector('.fav-toys__item-count')!;
      const count = parent.querySelectorAll<HTMLElement>('img');
      countElement.textContent = count.length.toString();
    };
    const handlerDragStart = (e: DragEvent): void => {
      e.dataTransfer!.setData('text', (e.currentTarget as HTMLElement).id);
    };
    const handlerDropToyContainer = (e: DragEvent): void => {
      const id = e.dataTransfer!.getData('text');
      const draggableElement = document.getElementById(id)!;
      const parentId = id.slice(0, id.indexOf('-'));
      draggableElement.style.top = `50%`;
      draggableElement.style.left = `50%`;
      draggableElement.style.transform = `translate(-50%, -50%)`;
      const parent = document.querySelector(`#toy${parentId}`)!;
      parent.appendChild(draggableElement);
      setCountToy(parentId);
    };
    const handlerDropTree = (e: DragEvent): void => {
      const id = e.dataTransfer!.getData('text');
      const draggableElement = document.getElementById(id)!;
      const parentId = id.slice(0, id.indexOf('-'));
      const draggableElementCoord = draggableElement.getBoundingClientRect();
      draggableElement.style.position = 'absolute';
      draggableElement.style.top = `${e.offsetY - draggableElementCoord.height / 2}px`;
      draggableElement.style.left = `${e.offsetX - draggableElementCoord.width / 2}px`;
      draggableElement.style.width = '60px';
      draggableElement.style.height = '60px';
      const dropzone = e.target!;
      (dropzone as HTMLElement).appendChild(draggableElement);
      setCountToy(parentId);
      e.dataTransfer!.clearData();
    };
    const handlerDragEnd = (e: DragEvent): void => {
      if (e.dataTransfer!.dropEffect === 'none') {
        console.log('canceled');
        const id = (e.target as HTMLElement)!.id;
        const parentId = id.slice(0, id.indexOf('-'));
        (e.currentTarget as HTMLElement).style.top = `50%`;
        (e.currentTarget as HTMLElement).style.left = `50%`;
        (e.currentTarget as HTMLElement).style.transform = `translate(-50%, -50%)`;
        const parent = document.querySelector(`#toy${parentId}`)!;
        parent.appendChild(e.currentTarget as HTMLElement);
        setCountToy(parentId);
      }
    };
    const toys = document.querySelectorAll<HTMLElement>('.toy-img');
    toys.forEach((item) => {
      item.addEventListener('dragstart', (e) => handlerDragStart(e));
      item.addEventListener('dragend', (e) => handlerDragEnd(e));
    });

    return true;
  }
}
