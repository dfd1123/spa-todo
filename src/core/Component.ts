import { updateElement } from './componentUpdate';
import { setCurrentObserver, observable } from './observer';
import { Store } from './Store';
import { StateType } from './types';

let uid = 0;

export default class Component<
  S extends StateType = StateType,
  P extends StateType = StateType,
  T extends Store = Store<any>
> {
  public uid: number;
  public $store: T;
  private storeUseKeys: string[] = [];
  public $state: ReturnType<this['data']>;
  public $props: P;
  public components: { [key: string]: Component } = {};
  public reqAnimationId = 0;

  constructor(public $target: HTMLElement, private getProps?: P) {
    this.uid = uid++;
    this.$props = getProps || ({} as P);

    this.$state = observable(this.data()) as ReturnType<this['data']>;
    this.create();
    this.render();

    this.setEvent();
  }

  create(): void {
    // create method
  }

  data() {
    return {};
  }

  template(): string {
    return '';
  }

  componentDidMount(): void {
    // componentDidMount
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateElement(parent: Element, oldNode: Element, newNode: Element) {
    // updateElement
  }

  setEvent(): void {
    // setEvent
  }

  render() {
    setCurrentObserver(this);
    const newNode = this.$target.cloneNode(true) as Element;
    newNode.innerHTML = this.template();

    const oldChildNodes = [...this.$target.childNodes] as Element[];
    const newChildNodes = [...newNode.childNodes] as Element[];
    const max = Math.max(oldChildNodes.length, newChildNodes.length);
    for (let i = 0; i < max; i++) {
      updateElement(this.$target, newChildNodes[i], oldChildNodes[i]);
    }

    this.componentDidMount();

    setCurrentObserver(null);
  }

  useStore(store: T, key: string) {
    this.$store = store;
    this.storeUseKeys.push(key);
  }

  observeFunc(key: string) {
    if (!key || this.storeUseKeys.includes(key)) {
      cancelAnimationFrame(this.reqAnimationId);
      this.reqAnimationId = requestAnimationFrame(this.render.bind(this));
    }
  }

  setState(newState: ReturnType<this['data']>) {
    Object.keys(newState).forEach((key) => {
      this.$state[key as keyof typeof newState] =
        newState[key as keyof typeof newState];
    });
  }

  addComponent<T extends Component>(
    componentClass: new (el: Element, props: StateType) => T,
    props: StateType = {},
    key = ''
  ) {
    if (!componentClass.name)
      throw new Error(
        'The first argument of addComponent should be passed the component class'
      );

    const selectors = this.$target.querySelectorAll(
      `[data-component="${componentClass.name}"]`
    );
    const el =
      key !== ''
        ? Array.from(selectors).find(
            (selector) => selector.getAttribute('key') === String(key)
          )
        : selectors[0];
    const componentKeyName = `${componentClass.name}${key}`;

    const updateComponent = () => {
      const oldComponent = this.components[componentKeyName];
      const component = new componentClass(el, props);

      component.updateElement = updateElement;

      this.components = {
        ...this.components,
        [componentKeyName]: component,
      };
    };

    if (el && !this.components[componentKeyName]) {
      updateComponent();
    } else if (el) {
      if (!Object.is(this.components[componentKeyName].$props, props)) {
        updateComponent();
      }
    }
  }

  addEvent(
    eventName: 'click' | 'input' | 'change' | 'keypress',
    selector: string,
    func: EventListenerOrEventListenerObject
  ) {
    const element = this.$target.querySelector(selector) as any;
    element[`on${eventName}`] = func;
  }
}
