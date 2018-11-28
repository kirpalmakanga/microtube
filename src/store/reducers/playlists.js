import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'playlists/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) =>
        updateObject(state, {
            items: [...state.items, ...items],
            nextPageToken: nextPageToken || null,
            totalResults
        }),

    'playlists/REMOVE_ITEM': (state, { data: { playlistId } }) =>
        updateObject(state, {
            items: state.items.filter((item) => item.id !== playlistId)
        }),

    'auth/SIGN_OUT': () => initialState
});
