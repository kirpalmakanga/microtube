import { createContext, useContext, useEffect, useMemo, FunctionComponent } from 'react';
import { useAsyncReducer } from './helpers';
import rootReducer, { rootInitialState } from './reducers';
import { saveState, loadState } from '../lib/localStorage';
import { pick, omit, deepMerge } from '../lib/helpers';

const initialState = deepMerge(rootInitialState, loadState() || {});

interface StorableState {
    player?: any,
    search?: any
}

export const StoreContext = createContext(initialState);

export const useStore = () => useContext(StoreContext);

const Store: FunctionComponent = ({ children }) => {
    const [state, dispatch] = useAsyncReducer(rootReducer, initialState);
    const store = useMemo(() => [state, dispatch], [state]);

    useEffect(() => {
        const { player, search }: StorableState = state;
        // TODO: save state to localStorage (check isEqualDeep)
        saveState({
            player: omit(player, ['newQueueItems', 'video']),
            search: pick(search, ['forMine'])
        });
    }, [state])

    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export default Store;
