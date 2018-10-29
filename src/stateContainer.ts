import {
  StateContainer,
  StateUpdater,
  StateListener,
  StateUnsubscribeFn,
  StateUpdaterFn
} from './types';

export function makeStateContainer<TState>(
  initialState?: TState
): StateContainer<TState> {
  let state: TState | undefined = initialState || void 0;
  let listeners: Array<StateListener<TState>> = [];

  return {
    getState() {
      return state;
    },

    updateState(updater: StateUpdater<TState>) {
      state =
        typeof updater === 'function'
          ? (updater as StateUpdaterFn<TState>)(state)
          : updater;
      for (const listener of listeners) {
        listener(state);
      }
    },

    subscribe(listenerFn: StateListener<TState>): StateUnsubscribeFn {
      listeners.push(listenerFn);

      return function unsubscribe() {
        listeners = listeners.filter(l => l !== listenerFn);
      };
    }
  };
}
