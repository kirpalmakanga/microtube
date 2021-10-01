import { useCallback, useReducer, useRef } from 'react';

export interface Action {
    type: string;
    payload?: object;
}

interface Handlers {
    [actionType: string]: (state: object, payload: object) => object;
}

interface Slices {
    [namespace: string]: Reducer;
}

type NotFunction<T> = T extends Function ? never : T;

export interface State {
    [key: string]: NotFunction<any>;
}

export interface RootState {
    [namespace: string]: State;
}

type Reducer = (state: State, action: Action) => object;
type RootReducer = (state: State, action: Action) => RootState;
type Thunk = (getState: Function) => void;
export type GetState = () => RootState;

export const createReducer =
    (initialState: State, handlers: Handlers): Reducer =>
    (state: State, { type, payload = {} }: Action) => {
        const { [type]: handler } = handlers;

        if (typeof handler === 'function') {
            return handler(state, payload);
        }

        return { ...initialState, ...state };
    };

export const useRootReducer = (
    reducer: Reducer,
    initialState: RootState | State
) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const stateRef = useRef(state);
    const getState = useCallback(() => stateRef.current, [state]);
    const reduce = useCallback(
        (action) => reducer(getState(), action),
        [reducer, getState]
    );
    const setState = useCallback(
        (action) => {
            stateRef.current = reduce(action);
            dispatch(action);
        },
        [state, dispatch]
    );

    const asyncDispatch = useCallback(
        (action: Action | Thunk) => {
            if (typeof action === 'function') {
                return action(getState);
            }
            return setState(action);
        },
        [getState, setState]
    );

    return [state, asyncDispatch];
};

export const combineReducers =
    (slices: Slices): RootReducer =>
    (rootState: RootState, action: Action) => {
        const result = { ...rootState };

        for (const [namespace, reducer] of Object.entries(slices)) {
            result[namespace] = reducer(result[namespace], action);
        }

        return result;
    };
