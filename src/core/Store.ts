import { observable } from './observer';
import { Mutation, Actions } from './types';

export class Store<S extends Record<string, any> = object> {
  public state: S;
  private mutations: Mutation<S>;
  private actions: Actions<S>;

  constructor({
    state = {} as S,
    mutations,
    actions,
  }: {
    state: S;
    mutations: Mutation<S>;
    actions?: Actions<S>;
  }) {
    this.state = observable(state, true);
    this.mutations = mutations;
  }

  commit(action: string, payload: any) {
    this.mutations[action](this.state, payload);
  }

  dispatch(action: string, payload: any) {
    return this.actions[action](
      {
        state: this.state,
        commit: this.commit.bind(this),
        dispatch: this.dispatch.bind(this),
      },
      payload
    );
  }
}
