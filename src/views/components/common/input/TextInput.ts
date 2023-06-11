import './TextInput.scss';
import Component from '@/core/Component';

export default class TextInput extends Component {
  data() {
    return {
      text: this.$props.value,
    };
  }

  template() {
    const { text = '' } = this.$state;
    const { type = 'text', placeholder = '' } = this.$props;
    // const text = this.$props.value || this.$state.text;
    return `
            <input type="${type}" value="${text}" placeholder="${placeholder}" />
        `;
  }

  setEvent() {
    const { onInput, onChange, onEnter } = this.$props;

    this.addEvent('input', 'input', (e: any) => {
      onInput && onInput(e.target);
    });

    this.addEvent('change', 'input', (e: any) => {
      onChange && onChange(e.target);
    });

    this.addEvent('keypress', 'input', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onEnter && onEnter(e.target);
      }
    });
  }
}
