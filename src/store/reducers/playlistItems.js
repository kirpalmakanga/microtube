import { createReducer } from '../helpers.js';

const initialState = {
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: 0,
    hasNextPage: true
};

export default createReducer(initialState, {
    'playlist/SET_TITLE': (state, { data: { playlistTitle } }) => ({
        ...state,
        playlistTitle
    }),

    'playlist/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) => ({
        ...state,
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistItemId } }) => {
        const items = state.items.filter(
            (item) => item.playlistItemId !== playlistItemId
        );

        return { ...state, items, totalResults: items.length };
    },

    'playlist/CLEAR_ITEMS': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
