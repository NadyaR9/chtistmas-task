'use strict';

import './styles/style.scss';

import { Home } from './pages/Home';
import { Toys } from './pages/Toys';
import { Firs } from './pages/Firs';
import { Error404 } from './pages/Error404';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { route } from './utils/route';
import { IComponent, IRoutes } from './interfaces/interfaces';

const homeInstance: IComponent = new Home();
const toysInstance: IComponent = new Toys();
const firsInstance: IComponent = new Firs();
const error404Instance: IComponent = new Error404();
const headerInstance: IComponent = new Header();
const footerInstance: IComponent = new Footer();

const routes: IRoutes = {
  '/': homeInstance,
  '/toys': toysInstance,
  '/firs': firsInstance,
};

const router = async () => {
  const header = null || document.getElementById('header_container');
  const content = null || document.getElementById('page_container');
  const footer = null || document.getElementById('footer_container');

  header!.innerHTML = await headerInstance.render();
  await headerInstance.after_render();

  footer!.innerHTML = await footerInstance.render();
  await footerInstance.after_render();

  const request = route.parseRequestURL();

  const parsedURL: string =
    (request.resource ? `/${request.resource}` : '/') +
    (request.id ? '/:id' : '') +
    (request.verb ? `/${request.verb}` : '');

  const page = routes[parsedURL] ? routes[parsedURL] : error404Instance;

  content!.innerHTML = await page.render();

  await page.after_render();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
