import Component from '@/core/Component';
import './TodoListWrap.scss';
import TodoItem, { TodoItemType } from './TodoItem';
import NoData from '../common/NoData';
import DragDrop from '@/modules/dragNdrop';
import { FilterKind } from './TodoListController';

export default class TodoListWrap extends Component {
  componentDidMount() {
    if (!Array.isArray(this.$props.list))
      throw new Error('TodoListWrap props list type is not array!!');

    const { list = [] } = this.$props;

    list.map((item: TodoItemType) => {
      this.addComponent(
        TodoItem,
        {
          info: item,
          handleStatusChange: (todoId: number) =>
            this.handleStatusChange(todoId),
          handleDelete: (todoId: number) => this.deleteTodoItem(todoId),
        },
        String(item.id)
      );
    });

    this.addComponent(NoData, { text: 'No data matching the criteria' });
  }
  filterShowList() {
    const { list, filterKind } = this.$props;

    switch (filterKind) {
      case 'active':
        return list.filter((item: TodoItemType) => !item.completed);
      case 'completed':
        return list.filter((item: TodoItemType) => item.completed);
      case 'all':
      default:
        return list;
    }
  }
  deleteTodoItem(todoId: number) {
    const { list, handleUpdateList } = this.$props;

    handleUpdateList &&
      handleUpdateList(list.filter((item: TodoItemType) => item.id !== todoId));
  }
  handleStatusChange(todoId: number) {
    const { list, handleUpdateList } = this.$props;

    handleUpdateList &&
      handleUpdateList(
        list.map((item: TodoItemType) =>
          item.id === todoId ? { ...item, completed: !item.completed } : item
        )
      );
  }
  handleListChange(todoIdList: string[]) {
    const { list, handleUpdateList } = this.$props;
    const newList = todoIdList.map((id) =>
      list.find((item: TodoItemType) => item.id === Number(id))
    );
    handleUpdateList && handleUpdateList(newList);
  }
  template() {
    const list = this.filterShowList();

    return `
            <ul class="todo-list-cont">
            ${list.length
        ? list
          .map(
            (item: TodoItemType) =>
              `<li key="${item.id
              }" data-component="TodoItem" class="todo-item" data-drag-id="${item.id
              }" draggable="${!item.completed}"></li>`
          )
          .join('')
        : '<div data-component="NoData"></div>'
      }
            </ul>
        `;
  }

  setEvent(): void {
    new DragDrop({
      listSelector: '.todo-list-cont',
      onListChange: (todoIdList) => this.handleListChange(todoIdList),
    });
  }
}
