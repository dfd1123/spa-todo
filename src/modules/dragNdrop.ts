const DRAG_ITEM_CLASSNAME = 'draggable-item';
const DRAG_TARGET_CLASSNAME = 'drag-target';
const DRAGGING_CLASSNAME = 'dragging';
const DRAG_PREVIEW_CLASSNAME = 'preview';
const DRAG_MIRROR_CLASSNAME = 'mirror';

export default class DragDrop {
  private listSelector: string;
  private $listContEl: HTMLElement;
  private dragListArr: HTMLElement[];
  protected isDragging = false;
  private $draggedItem: HTMLElement;
  private drageedIndex: number = -1;
  private dragTimeoutId: number = -1;
  private dragReadyTimeoutId: number = -1;
  private $mirrorElement: HTMLElement = null;
  private isMoved = false;
  private translateX = 0;
  private initialY = 0;
  private onListChange?: (newIdList: string[]) => void;

  constructor({
    listSelector,
    onListChange,
  }: {
    listSelector: string;
    onListChange?: (newIdList: string[]) => void;
  }) {
    this.listSelector = listSelector;
    this.$listContEl = document.querySelector(listSelector);
    this.dragListArr = [...this.$listContEl.children] as HTMLElement[];
    this.onListChange = onListChange;

    this.dragListArr.forEach((el) => {
      el.classList.add(DRAG_ITEM_CLASSNAME);
    });

    this.init();
  }

  init() {
    window.onmousemove = (e) => this.handleDragMove(e);
    window.onmouseup = (e) => this.handleWindowDragEnd(e);
    window.onkeydown = (e) => this.handleKeyEscape(e);

    this.dragListArr.forEach((item) => {
      item.onmousedown = (e) => this.handleDragStart(e);
      item.onmouseup = (e) => this.handleDragEnd(e);
    });
  }

  targetAddClass(target: HTMLElement, className: string) {
    this.dragListArr.forEach((el) => {
      el.classList.remove(className);
    });
    target && target.classList.add(className);
  }

  setDragTargetPosition(target: HTMLElement) {
    const targetIndex = this.dragListArr.indexOf(target);

    if (targetIndex > -1 && this.$draggedItem && target !== this.$draggedItem) {
      this.$listContEl?.removeChild(this.$draggedItem);
      if (targetIndex < this.drageedIndex) {
        target.before(this.$draggedItem);
        this.drageedIndex = targetIndex - 1;
      } else if (targetIndex > this.drageedIndex) {
        target.after(this.$draggedItem);
        this.drageedIndex = targetIndex + 1;
      }

      window.clearTimeout(this.dragTimeoutId);

      this.targetAddClass(this.$draggedItem, DRAG_TARGET_CLASSNAME);
      this.targetAddClass(this.$draggedItem, DRAG_PREVIEW_CLASSNAME);

      this.dragListArr = [...this.$listContEl.children] as HTMLElement[];
    }
  }

  handleKeyEscape(event: KeyboardEvent) {
    if (this.isDragging && event.key === 'Escape') {
      this.$draggedItem = null;
      this.isDragging = false;
      this.drageedIndex = null;

      if (this.$mirrorElement?.parentNode) {
        this.$mirrorElement.parentNode.removeChild(this.$mirrorElement);
      }
    }
  }

  handleDragStart(event: MouseEvent) {
    this.isMoved = false;

    const target = (event.target as HTMLElement).closest(
      `.${DRAG_ITEM_CLASSNAME}`
    ) as HTMLElement;

    if (!target.draggable) return;

    this.$draggedItem = event.currentTarget as HTMLElement;

    target.classList.add(DRAGGING_CLASSNAME);
    this.drageedIndex = Array.from(this.$listContEl.children).indexOf(
      this.$draggedItem
    );

    this.isDragging = true;

    this.$mirrorElement = this.$draggedItem.cloneNode(true) as HTMLElement;
    this.$mirrorElement.classList.add(DRAG_MIRROR_CLASSNAME);

    const rect = this.$draggedItem.getBoundingClientRect();
    this.initialY = rect.top;

    this.$mirrorElement.style.position = 'fixed';
    this.$mirrorElement.style.left = `${rect.left}px`;
    this.$mirrorElement.style.top = `${rect.top}px`;
    this.$mirrorElement.style.width = `${rect.width}px`;
    this.$mirrorElement.style.pointerEvents = 'none';

    this.$listContEl.appendChild(this.$mirrorElement);
  }

  handleDragMove(event: MouseEvent) {
    this.isMoved = true;

    if (this.isDragging) {
      event.preventDefault();

      this.translateX += event.movementX;

      this.$mirrorElement.style.transform = `translate(${this.translateX}px, ${
        event.clientY - this.initialY
      }px)`;

      const target = (event.target as HTMLElement).closest(
        `.${DRAG_ITEM_CLASSNAME}`
      ) as HTMLElement;

      this.targetAddClass(target, DRAG_TARGET_CLASSNAME);

      window.clearTimeout(this.dragTimeoutId);
      this.dragTimeoutId = window.setTimeout(() => {
        this.setDragTargetPosition(target);
      }, 1000);
    }
  }

  handleDragEnd(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();

      const target = (event.target as HTMLElement).closest(
        `.${DRAG_ITEM_CLASSNAME}`
      ) as HTMLElement;

      this.setDragTargetPosition(target);

      this.onListChange &&
        this.onListChange(this.dragListArr.map((el) => el.dataset.dragId));
    }
  }

  handleWindowDragEnd(event: MouseEvent) {
    if (this.isDragging && this.isMoved) {
      event.preventDefault();

      this.isDragging = false;
      this.isMoved = false;
      this.$draggedItem = null;
      this.drageedIndex = null;

      if (this.$mirrorElement?.parentNode) {
        this.dragListArr.forEach((el) => {
          el.classList.remove(DRAG_TARGET_CLASSNAME);
          el.classList.remove(DRAGGING_CLASSNAME);
        });

        this.$mirrorElement.parentNode.removeChild(this.$mirrorElement);
      }

      this.onListChange &&
        this.onListChange(this.dragListArr.map((el) => el.dataset.dragId));
    }
  }
}
