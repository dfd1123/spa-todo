import '@/styles/pages/NotFound.scss';
import Component from '@/core/Component';

export default class NotFound extends Component {
  template() {
    return `
            <div data-component="NotFound" NotFound>
                <h1>404 : Not Found Page</h1>
            </div>
        `;
  }
}
