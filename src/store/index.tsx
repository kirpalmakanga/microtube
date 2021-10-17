import { createContext, useContext, createEffect, mergeProps } from 'solid-js';
import { createStore } from 'solid-js/store';
import { rootInitialState } from './reducers';
import { saveState, loadState } from '../lib/localStorage';
import { mergeDeep, pick, omit } from '../lib/helpers';

const initialState = mergeDeep(rootInitialState, loadState() || {});
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
            player: omit(player, ['newQueueItems', 'video']),
            search: pick(search, ['forMine'])
        });
    });

    return (
        <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    );
};

export const useStore = (): any => useContext(StoreContext);
