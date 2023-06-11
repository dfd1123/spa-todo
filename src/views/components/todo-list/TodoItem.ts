import Component from '@/core/Component';
import './TodoItem.scss';
import Button from '@components/common/button/Button';

export type TodoItemType = { id: number; name: string; completed: boolean };

export default class TodoItem extends Component {
  componentDidMount() {
    this.addComponent(Button, {
      text: '삭제',
      onClick: () => this.deleteTodoItem(),
    });
  }
  deleteTodoItem() {
    const { info, handleDelete } = this.$props;

    if (window.confirm('Are you sure you want to clear this TODO entry?')) {
      handleDelete && handleDelete(info.id);
    }
  }
  template() {
    const { info } = this.$props as { info: TodoItemType };
    return `  
            <div class="todo-item">
                <span class="todo-item-name ${
                  info.completed ? 'completed' : ''
                }">
                ${info.name}
                </span>
                <div data-component="Button" class="btn-delete"></div>
            </div>
        `;
  }

  setEvent() {
    const { info, handleStatusChange } = this.$props;

    this.addEvent('click', '.todo-item-name', (e) => {
      handleStatusChange && handleStatusChange(info.id);
    });
  }
}
