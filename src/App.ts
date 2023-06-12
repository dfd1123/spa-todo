import Component from './core/Component';
import { RouterView } from '@/core/Router';

export default class App extends Component {
  componentDidMount() {
    this.addComponent(RouterView);
  }

  template() {
    return `
        <div data-component="RouterView"></div>
    `;
  }
}
