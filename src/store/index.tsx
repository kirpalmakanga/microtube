import {
    createContext,
    useContext,
    createEffect,
    ParentComponent
} from 'solid-js';
import { createStore, SetStoreFunction, Store } from 'solid-js/store';
import { rootInitialState, RootState } from './_state';
import { saveState, loadState } from '../lib/localStorage';
import { mergeDeep, pick, omit } from '../lib/helpers';

const StoreContext = createContext();

export const StoreProvider: ParentComponent = (props) => {
    const store = createStore<RootState>(
        mergeDeep(rootInitialState(), loadState() || {}) as RootState
    );

    createEffect(() => {
        const [{ user, player, search }] = store;

        saveState({
            user,
            player: omit(player, 'newQueueItems', 'video', 'currentVideo'),
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
