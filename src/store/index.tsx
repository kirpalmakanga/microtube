import { createContext, useContext, createEffect, Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { rootInitialState, RootState } from './_state';
import { saveState, loadState } from '../lib/localStorage';
import { mergeDeep, pick, omit } from '../lib/helpers';

const initialState = mergeDeep(rootInitialState(), loadState() || {});
const StoreContext = createContext();

export const StoreProvider: Component = (props) => {
    const store = createStore<RootState>(initialState as RootState);

    createEffect(() => {
        const [{ player, search }] = store;

        saveState({
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

export const useStore = (): any => useContext(StoreContext);
