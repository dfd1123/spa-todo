import Component from '@/core/Component';
import './TodoListController.scss';
import Button from '@components/common/button/Button';
import { TodoItemType } from './TodoItem';
import Tab, { TabItem } from '../common/tab/Tab';

export type FilterKind = 'all' | 'active' | 'completed';
type StateType = {
  filterKind: FilterKind;
  tabList: TabItem[];
};

export default class TodoListController extends Component {
  data(): StateType {
    return {
      filterKind: this.$props.filterKind ?? 'all',
      tabList: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
    };
  }
  componentDidMount() {
    const { tabList } = this.$state;
    const { list, filterKind } = this.$props;

    this.addComponent(Tab, {
      list: tabList,
      value: filterKind,
      handleChange: ({ value }: { value: FilterKind }) =>
        this.handleFilterKindChange(value),
    });
    this.addComponent(
      Button,
      {
        text: `Clear Completed (${
          list.filter((item: TodoItemType) => item.completed).length
        })`,
        onClick: () => this.handleClearCompleted(),
      },
      'clear-completed'
    );
  }
  handleFilterKindChange(kind: FilterKind) {
    const { handleFilterKind } = this.$props;
    this.setState({ ...this.$state, filterKind: kind });
    handleFilterKind && handleFilterKind(kind);
  }
  handleClearCompleted() {
    if (
      window.confirm(
        'Clearing completed Todo items makes them difficult to recover. Would you still?'
      )
    ) {
      const { list, handleUpdateList } = this.$props;
      handleUpdateList &&
        handleUpdateList(list.filter((item: TodoItemType) => !item.completed));
    }
  }

  template() {
    const { list } = this.$props;
    const leftCnt = list.filter((item: TodoItemType) => !item.completed).length;

    return `
        <div class="todo-control-area">
            <div class="item-left-info">
            ${leftCnt} items left
            </div>
            <div data-component="Tab" class="filter-btn-cont"></div>
            <div class="clear-btn-cont">
                <div data-component="Button" key="clear-completed"></div>
            </div>
        </div>
        `;
  }
}
