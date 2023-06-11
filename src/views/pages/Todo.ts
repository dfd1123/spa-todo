import Component from '@/core/Component';
import '@styles/pages/Todo.scss';

export default class Todo extends Component {
  template() {
    return `
            <div data-component="Todo">
                <div class="todo-box-area">
                  <div class="inp">
                    <input placeholder="What needs to be done?" />
                  </div>
                  <ul class="todo-list-cont">
                    <li class="todo-item">
                      <span class="name">3</span>
                      <button>삭제</button>
                    </li>
                  </ul>
                  <div class="todo-control-area">
                    <div class="item-left-info">
                      0 items left
                    </div>
                    <div class="filter-btn-cont">
                      <button>All</button>
                      <button>Active</button>
                      <button>Completed</button>
                    </div>
                    <div class="clear-btn-cont">
                      <button>Clear Completed (0)</button>
                    </div>
                  </div>
                </div>
            </div>
        `;
  }
}
