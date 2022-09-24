import { createContext, useContext, createEffect, Component } from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { rootInitialState, RootState } from './_state';
import { saveState, loadState } from '../lib/localStorage';
import { mergeDeep, pick, omit } from '../lib/helpers';

const initialState = mergeDeep(rootInitialState(), loadState() || {});
const StoreContext = createContext();

const createProvidedStore = () =>
    createStore<RootState>(initialState as RootState);

export const StoreProvider: Component = (props) => {
    const store = createProvidedStore();

    createEffect(() => {
        const [{ user, player, search }] = store;

        saveState({
            user,
            player: omit(player, 'newQueueItems', 'video'),
            search: pick(search, 'forMine')
        });
    });

    return (
        <StoreContext.Provider value={store}>
            {props.children}
        </StoreContext.Provider>
    );
};

export const useStore = () =>
    useContext(StoreContext) as [Store<RootState>, SetStoreFunction<RootState>];
