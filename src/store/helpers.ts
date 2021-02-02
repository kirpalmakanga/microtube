import { useCallback, useReducer } from 'react';

export interface Action {
    type: string,
    payload?: object
}

interface Handlers {
    [actionType: string]: (state: object, payload: object) => object
}

interface Slices {
    [namespace: string]: Reducer
}

type NotFunction<T> = T extends Function ? never : T;

export interface State {
    [key: string]: NotFunction<any>;
}

export interface RootState {
    [namespace: string]: State
}

type Reducer = (state: State, action: Action) => object;
type RootReducer = (state: State, action: Action) => RootState;
type Dispatch<Action> = (action: Action) => void;
type AsyncDispatch<Action> = Dispatch<Action | Promise<Action>>; 

export const createReducer = (initialState: object, handlers: Handlers): Reducer => (
    state: object,
    { type, payload = {} } : Action
) => {
    const { [type]: handler } = handlers;

    if (typeof handler === 'function') {
        return handler(state, payload);
    }

    return { ...initialState, ...state };
};

const wrapAsync = (dispatch: Dispatch<Action>) : AsyncDispatch<Action> => (action: Action | Promise<Action>) => {
    if (action instanceof Promise) {
        return action.then(dispatch);
    }
    return dispatch(action);
}

export const useAsyncReducer = (reducer: Reducer, initialState: RootState | State) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const asyncDispatch = useCallback(wrapAsync(dispatch), [dispatch])

    return [state, asyncDispatch];
}

export const combineReducers = (slices: Slices): RootReducer => (rootState: RootState, action: Action) => {
    const result = { ...rootState };

    for (const [namespace, reducer] of Object.entries(slices)) {
        result[namespace] = reducer(result[namespace], action);
    }

    return result;
}
