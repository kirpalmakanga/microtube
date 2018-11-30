import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    channelTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'channel/SET_TITLE': (state, { data: { channelTitle } }) =>
        updateObject(state, { channelTitle }),

    'channel/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) =>
        updateObject(state, {
            items: [...state.items, ...items],
            nextPageToken: nextPageToken || null,
            totalResults
        }),

    'channel/CLEAR': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
