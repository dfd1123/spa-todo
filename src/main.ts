import { Route } from '@/core/Router';
import routes from './router';
import App from './App';

new Route(routes).init();

new App(document.querySelector('#app'));
