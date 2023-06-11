import Component from '../Component';

export interface StateType {
  [key: string]: any;
}

export interface EventListenerParams {
  eventName: string;
  selector: string;
  func: (this: Element, ev: Event) => any;
}

export interface RouteType<T extends Component = Component> {
  path: string;
  redirect?: string;
  view?: new (el: Element, props?: StateType) => T;
}

interface Mutation<S extends Record<string, any>> {
  [key: string]: (state: S, payload: any) => void;
}

interface Actions<S extends Record<string, any>> {
  [key: string]: (
    params: {
      state: S;
      commit: (action: string, payload: string) => void;
      dispatch: (action: string, payload: string) => void;
    },
    payload: string
  ) => void;
}
