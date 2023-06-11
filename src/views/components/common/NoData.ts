import './NoData.scss';
import Component from '@/core/Component';

export default class NoData extends Component {
  template() {
    return `
            <span>
                ${this.$props.text}
            </span>
        `;
  }
}
