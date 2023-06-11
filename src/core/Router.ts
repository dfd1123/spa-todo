import Component from '@/core/Component';
import { RouteType } from '@/core/types';
import NotFound from '@pages/NotFound';

export class Route {
  routes;

  constructor(routes: RouteType[] = []) {
    this.routes = routes;
  }

  init() {
    window.addEventListener('popstate', this.router.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      document.body.addEventListener('click', (e: any) => {
        if (e.target.matches('[data-link]')) {
          e.preventDefault();
          this.navigateTo(e.target.href);
        }
      });

      this.router();
    });
  }

  router() {
    const pathToRegex = (path: string) =>
      new RegExp(
        '^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$'
      );

    const potentialMatches = this.routes.map((route) => {
      return {
        route,
        result: location.pathname.match(pathToRegex(route.path)),
      };
    });

    let match = potentialMatches.find(
      (potentialMatch) => potentialMatch.result !== null
    );

    if (!match) {
      match = {
        route: {
          path: '/404',
          view: NotFound,
        },
        result: [location.pathname],
      };

      if (location.pathname !== '/404')
        return this.navigateTo(match.route.path);
    } else if (match.route.redirect) {
      return this.navigateTo(match.route.redirect);
    }
    document.querySelector('#router-view').innerHTML = '';
    new match.route.view(document.querySelector('#router-view'));
  }

  getParams(match: any) {
    const values = match.result.slice(1);
    const keys = (
      Array.from(match.route.path.matchAll(/:(\w+)/g)) as any[]
    ).map((result) => result[1]);

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  }

  getQuerys() {
    const queryString = window.location.search;
    const queryParameters = queryString.substring(1).split('&');
    const queryParamsObject: { [key: string]: string } = {};

    for (let i = 0; i < queryParameters.length; i++) {
      const [key, value] = queryParameters[i].split('=');
      queryParamsObject[key] = decodeURIComponent(value);
    }

    return queryParamsObject || {};
  }

  navigateTo(url: string) {
    history.pushState(null, '', url);
    this.router();
  }
}

export class RouterView extends Component {
  template() {
    return `
            <div id="router-view"></div>
        `;
  }
}

const { navigateTo, getQuerys, getParams } = new Route();

export { navigateTo, getQuerys, getParams };

export class Link extends Component {
  template() {
    const { href = '', text = '' } = this.$props;
    return `
        <a data-link href="${href}">${text}</a>
     `;
  }
}
