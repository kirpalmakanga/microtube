import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import rootReducer from './reducers';

import { STORAGE_KEY } from '../config/app';

const enhancer = compose(
    applyMiddleware(thunk),
    persistState(['auth', 'player'], {
        key: STORAGE_KEY,
        slicer: () => ({ auth: { isSignedIn, ...auth }, player }) => ({
            auth,
            player
        }),
        merge: (initialState, storage = {}) => ({ ...initialState, ...storage })
    })
);

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

    return store;
}
