import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

import { saveState, loadState } from '../lib/localStorage';

import { pick, omit, throttle } from '../lib/helpers';

const composeEnhancers =
    typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

export default function configureStore() {
    const persistedState = loadState();
    const store = createStore(rootReducer, persistedState, enhancer);

    store.subscribe(
        throttle(() => {
            const { player, search } = store.getState();

            saveState({
                player: omit(player, ['newQueueItems', 'video']),
                search: pick(search, ['forMine'])
            });
        }, 500)
    );

    return store;
}
