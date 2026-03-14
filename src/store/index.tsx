import { createEffect, createRoot } from 'solid-js';
import { createStore } from 'solid-js/store';
import { rootInitialState, RootState } from './_state';
import { saveState, loadState } from '../lib/localStorage';
import { mergeDeep, pick, omit } from '../lib/helpers';

const rootStore = createRoot(() => {
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

    return store;
});

export const useStore = () => rootStore;
