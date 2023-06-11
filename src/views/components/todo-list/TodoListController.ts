import Component from '@/core/Component';
import './TodoListController.scss';
import Button from '@components/common/button/Button';
import { TodoItemType } from './TodoItem';

export type FilterKind = 'all' | 'active' | 'completed';
type StateType = {
  filterKind: FilterKind;
};

export default class TodoListController extends Component {
  data(): StateType {
    return {
      filterKind: this.$props.filterKind ?? 'all',
    };
  }
  componentDidMount() {
    const { list } = this.$props;

    this.addComponent(
      Button,
      { text: 'All', onClick: () => this.handleFilterKindChange('all') },
      'is-all'
    );
    this.addComponent(
      Button,
      { text: 'Active', onClick: () => this.handleFilterKindChange('active') },
      'is-active'
    );
    this.addComponent(
      Button,
      {
        text: 'Completed',
        onClick: () => this.handleFilterKindChange('completed'),
      },
      'is-completed'
    );
    this.addComponent(
      Button,
      {
        text: `Clear Completed (${
          list.filter((item: TodoItemType) => item.completed).length
        })`,
      },
      'clear-completed'
    );
  }
  handleFilterKindChange(kind: FilterKind) {
    const { handleFilterKind } = this.$props;
    this.setState({ ...this.$state, filterKind: kind });
    handleFilterKind && handleFilterKind(kind);
  }

  template() {
    const { list } = this.$props;
    const leftCnt = list.filter((item: TodoItemType) => !item.completed).length;

    return `
        <div class="todo-control-area">
            <div class="item-left-info">
            ${leftCnt} items left
            </div>
            <div class="filter-btn-cont">
                <div data-component="Button" key="is-all" class="${
                  this.$state.filterKind === 'all' ? 'active' : ''
                }">All</div>
                <div data-component="Button" key="is-active" class="${
                  this.$state.filterKind === 'active' ? 'active' : ''
                }">Active</div>
                <div data-component="Button" key="is-completed" class="${
                  this.$state.filterKind === 'completed' ? 'active' : ''
                }">Completed</div>
            </div>
            <div class="clear-btn-cont">
                <div data-component="Button" key="clear-completed"></div>
            </div>
        </div>
        `;
  }
}
