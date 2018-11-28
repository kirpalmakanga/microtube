import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'playlist/OPEN': (state, { data: { playlistTitle } }) =>
        updateObject(state, {
            playlistTitle
        }),

    'playlist/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) =>
        updateObject(state, {
            items: [...state.items, ...items],
            nextPageToken: nextPageToken || null,
            totalResults
        }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistItemId } }) =>
        updateObject(state, {
            items: items.filter(
                (item) => item.playlistItemId !== playlistItemId
            )
        }),

    'playlist/CLEAR_ITEMS': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
