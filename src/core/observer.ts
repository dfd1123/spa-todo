import Component from './Component';

let currentObserver: Component | null = null;
export const setCurrentObserver = (observer: Component) => {
  currentObserver = observer;
};

export const observable = <T extends object>(target: T, isStore = false): T => {
  Object.keys(target).forEach((key) => {
    let cache = target[key as keyof typeof target];

    let component: Component | null = null;

    Object.defineProperty(target, key, {
      get() {
        if (currentObserver) {
          component = currentObserver;
        }

        return cache;
      },
      set(value) {
        cache = value;
        component && component.observeFunc(isStore ? key : '')
      },
    });
  });

  return target;
};
