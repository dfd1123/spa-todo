import Component from '@/core/Component';
import '@styles/pages/Todo.scss';
import TextInput from '@components/common/input/TextInput';
import TodoListWrap from '@components/todo-list/TodoListWrap';
import TodoListController, {
  FilterKind,
} from '@components/todo-list/TodoListController';
import { TodoItemType } from '@components/todo-list/TodoItem';

type StateType = {
  filterKind: FilterKind;
  list: TodoItemType[];
};

export default class Todo extends Component {
  data(): StateType {
    return {
      filterKind: 'all',
      list: [{ id: 1, name: '3', completed: false }],
    };
  }
  componentDidMount() {
    const { list, filterKind } = this.$state;

    this.addComponent(TextInput, {
      placeholder: 'What needs to be done?',
      onEnter: (target: { value: string }) => {
        this.handleTodoAdd(target.value);
        target.value = '';
      },
    });
    this.addComponent(TodoListWrap, {
      list: this.filterShowList(),
      handleUpdateList: (newList: TodoItemType[]) =>
        this.handleUpdateList(newList),
    });
    this.addComponent(TodoListController, {
      list,
      filterKind,
      handleFilterKind: (kind: FilterKind) => this.handleFilterKind(kind),
      handleUpdateList: (newList: TodoItemType[]) =>
        this.handleUpdateList(newList),
    });
  }
  handleFilterKind(filterKind: FilterKind) {
    this.setState({ ...this.$state, filterKind });
  }
  filterShowList() {
    const { list, filterKind } = this.$state;

    switch (filterKind) {
      case 'active':
        return list.filter((item) => !item.completed);
      case 'completed':
        return list.filter((item) => item.completed);
      case 'all':
      default:
        return list;
    }
  }
  handleTodoAdd(value: string) {
    if (!value) return;

    const lastItemId =
      this.$state.list.length > 0
        ? this.$state.list[this.$state.list.length - 1].id
        : 0;

    this.setState({
      ...this.$state,
      text: '',
      list: [
        ...this.$state.list,
        { id: lastItemId + 1, name: value, completed: false },
      ],
    });
  }
  handleUpdateList(list: TodoItemType[]) {
    this.setState({
      ...this.$state,
      list,
    });
  }
  template() {
    return `
            <div data-component="Todo">
                <div class="todo-box-area">
                  <div data-component="TextInput"></div>
                  <div data-component="TodoListWrap"></div>
                  <div data-component="TodoListController"></div>
                </div>
            </div>
        `;
  }
}
