const DRAG_ITEM_CLASSNAME = 'draggable-item';
const DRAG_TARGET_CLASSNAME = 'drag-target';
const DRAGGING_CLASSNAME = 'dragging';
const DRAG_PREVIEW_CLASSNAME = 'preview';
const DRAG_MIRROR_CLASSNAME = 'mirror';

export default class DragDrop {
  private listSelector: string;
  private $listContEl: HTMLElement;
  private prevDragListArr: HTMLElement[];
  private dragListArr: HTMLElement[];
  private isDragging = false;
  private $draggedItem: HTMLElement;
  private drageedIndex: number = -1;
  private dragTimeoutId: number = -1;
  private mousedownTimeoutId: number = -1;
  private $mirrorElement: HTMLElement = null;
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
      item.onmousedown = (e) => this.handleMouseDown(e);
      item.onmouseup = (e) => this.handleDragEnd(e);
    });
  }

  targetAddClass(target: HTMLElement, className: string) {
    this.dragListArr.forEach((el) => {
      el.classList.remove(className);
    });
    target && target.classList.add(className);
  }

  setDragItemInfo(event: MouseEvent) {
    this.$draggedItem = this.getClosetDraggableTarget(event);
    this.drageedIndex = Array.from(this.$listContEl.children).indexOf(
      this.$draggedItem
    );
  }

  setDragTargetPosition(target: HTMLElement) {
    this.prevDragListArr = [...this.dragListArr];
    const targetIndex = this.dragListArr.indexOf(target);

    if (targetIndex > -1 && this.$draggedItem && target !== this.$draggedItem) {
      this.$listContEl?.removeChild(this.$draggedItem);
      if (targetIndex <= this.drageedIndex) {
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

  getClosetDraggableTarget(event: MouseEvent) {
    return (event.target as HTMLElement).closest(
      `.${DRAG_ITEM_CLASSNAME}`
    ) as HTMLElement;
  }

  deleteMirrorElements() {
    if (this.$mirrorElement?.parentNode) {
      this.$mirrorElement.parentNode.removeChild(this.$mirrorElement);
    }

    const els = [...document.body.querySelectorAll('.todo-item.mirror')];
    els.forEach((el) => el.remove());
  }

  resetDragStatus() {
    this.$draggedItem = null;
    this.isDragging = false;
    this.drageedIndex = null;

    this.dragListArr.forEach((el) => {
      el.classList.remove(DRAG_TARGET_CLASSNAME);
      el.classList.remove(DRAGGING_CLASSNAME);
    });

    this.deleteMirrorElements();
  }

  onListChangeTrigger() {
    this.onListChange &&
      this.onListChange(
        this.dragListArr.map((el) => el.dataset.dragId).filter((id) => !!id)
      );
  }

  mirrorElementCreate() {
    this.$mirrorElement = this.$draggedItem.cloneNode(true) as HTMLElement;
    this.$mirrorElement.classList.add(DRAG_MIRROR_CLASSNAME);

    const rect = this.$draggedItem.getBoundingClientRect();
    this.initialY = rect.top;

    this.$mirrorElement.style.position = 'fixed';
    this.$mirrorElement.style.left = `${rect.left}px`;
    this.$mirrorElement.style.top = `${rect.top}px`;
    this.$mirrorElement.style.width = `${rect.width}px`;
    this.$mirrorElement.style.pointerEvents = 'none';

    document.body.appendChild(this.$mirrorElement);
  }

  handleKeyEscape(event: KeyboardEvent) {
    if (this.isDragging && event.key === 'Escape') {
      this.resetDragStatus();
      this.dragListArr = [...this.prevDragListArr];
      this.onListChangeTrigger();
    }
  }

  handleMouseDown(event: MouseEvent) {
    // 마우스 오른쪽 버튼 클릭 시 무시
    if (event.button === 2) return;

    const target = this.getClosetDraggableTarget(event);

    // 드래그할 수 없는 아이템일 경우 무시
    if (!target.draggable) return;

    this.mousedownTimeoutId = window.setTimeout(() => {
      this.setDragItemInfo(event);
      target.classList.add(DRAGGING_CLASSNAME);
      this.mirrorElementCreate();

      this.isDragging = true;
    }, 150);
  }

  handleDragMove(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();

      this.translateX += event.movementX;

      this.$mirrorElement.style.transform = `translate(${this.translateX}px, ${event.clientY - this.initialY
        }px)`;

      const target = this.getClosetDraggableTarget(event);

      this.targetAddClass(target, DRAG_TARGET_CLASSNAME);

      window.clearTimeout(this.dragTimeoutId);
      this.dragTimeoutId = window.setTimeout(() => {
        this.setDragTargetPosition(target);
        window.clearTimeout(this.dragTimeoutId);
      }, 1000);
    } else {
      window.clearTimeout(this.mousedownTimeoutId);
    }
  }

  handleDragEnd(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();

      const target = this.getClosetDraggableTarget(event);

      this.setDragTargetPosition(target);
      this.resetDragStatus();
      this.onListChangeTrigger();
    }

    window.clearTimeout(this.mousedownTimeoutId);
  }

  handleWindowDragEnd(event: MouseEvent) {
    if (this.isDragging) {
      event.preventDefault();

      this.resetDragStatus();
      this.onListChangeTrigger();
    }

    window.clearTimeout(this.mousedownTimeoutId);
  }
}
