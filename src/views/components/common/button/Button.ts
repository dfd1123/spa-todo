import './Button.scss';
import Component from '@/core/Component';

export default class Button extends Component {
  template() {
    const { type = 'button', text = '' } = this.$props;
    return `
            <button type="${type}">${text}</button>
        `;
  }

  setEvent() {
    const { onClick, text } = this.$props;

    this.addEvent('click', 'button', onClick);
  }
}
