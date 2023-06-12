import Button from '../button/Button';
import './Tab.scss';
import Component from '@/core/Component';

export type TabItem = {
  label: string;
  value: string | number;
};

type PropsType = {
  list: TabItem[];
  value: string | number;
  handleChange?: (target: HTMLInputElement) => void;
};

export default class Tab extends Component {
  componentDidMount() {
    const { list = [], handleChange } = this.$props as PropsType;

    list.map((item) =>
      this.addComponent(
        Button,
        {
          text: item.label,
          //   onClick: () => handleChange && handleChange(item.value),
        },
        item.label
      )
    );
  }
  template() {
    const { list = [], value } = this.$props as PropsType;
    return `
            ${list
              .map(
                (item, index) => `
                <label class="tab">
                    <input type="radio" id="Tab-${
                      this.uid
                    }-${index}" name="Tab-${this.uid}" value="${item.value}" ${
                  item.value === value ? 'checked' : ''
                } />
                <span>${item.label}</span>
                </label>
            `
              )
              .join('')}
        `;
  }
  setEvent(): void {
    const { list = [], handleChange } = this.$props as PropsType;
    list.map((item, index) =>
      this.addEvent('change', `#Tab-${this.uid}-${index}`, (e) => {
        handleChange && handleChange(e.target as HTMLInputElement);
      })
    );
  }
}
