import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    channelTitle: '',
    thumbnails: {},
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'channel/UPDATE_DATA': (state, { data }) => updateObject(state, data),

    'channel/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) =>
        updateObject(state, {
            items: [...state.items, ...items],
            nextPageToken: nextPageToken || null,
            totalResults
        }),

    'channel/CLEAR_ITEMS': (state) =>
        updateObject(state, {
            items: [],
            nextPageToken: '',
            totalResults: 0
        }),

    'channel/CLEAR_DATA': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
