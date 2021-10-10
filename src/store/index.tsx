import { createContext, useContext, createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import merge from 'lodash/merge';
import { rootInitialState } from './reducers';
import { saveState, loadState } from '../lib/localStorage';
import { pick, omit } from '../lib/helpers';

const initialState = merge(rootInitialState, loadState() || {});
const StoreContext = createContext();

export const StoreProvider = ({
    children = () => {}
}: {
    children: unknown;
}) => {
    const store = createStore(initialState);

    createEffect(() => {
        const [{ player, search }] = store;

        saveState({
            player: omit(player, ['queue', 'newQueueItems', 'video']),
            search: pick(search, ['forMine'])
        });
    });

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

export const useStore = (): any => useContext(StoreContext);
