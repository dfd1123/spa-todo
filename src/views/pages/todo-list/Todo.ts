import Component from '@/core/Component';
import '@styles/pages/Todo.scss';
import TextInput from '@components/common/input/TextInput';
import TodoListWrap from '@components/todo-list/TodoListWrap';
import TodoListController, {
  FilterKind,
} from '@components/todo-list/TodoListController';
import { TodoItemType } from '@components/todo-list/TodoItem';
import { getCookie, setCookie } from '@/modules/Cookie';

type StateType = {
  filterKind: FilterKind;
  list: TodoItemType[];
};

export default class Todo extends Component {
  data(): StateType {
    return {
      filterKind: 'all',
      list: getCookie('todoList'),
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
      list,
      filterKind,
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
  handleTodoAdd(value: string) {
    if (!value) return;

    const lastItemId =
      this.$state.list.length > 0
        ? this.$state.list[this.$state.list.length - 1].id
        : 0;

    const newList = [
      ...this.$state.list,
      { id: lastItemId + 1, name: value, completed: false },
    ];

    this.handleUpdateList(newList)
  }
  handleUpdateList(list: TodoItemType[]) {
    setCookie('todoList', list, 30);

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
