import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'playlist/SET_TITLE': (state, { data: { playlistTitle } }) =>
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

    'playlist/REMOVE_ITEM': (state, { data: { playlistItemId } }) => {
        const items = state.items.filter(
            (item) => item.playlistItemId !== playlistItemId
        );

        return updateObject(state, {
            items,
            totalResults: items.length
        });
    },

    'playlist/CLEAR_ITEMS': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
