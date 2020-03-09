import { createReducer } from '../helpers';

const initialState = {
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

export default createReducer(initialState, {
    'playlist/SET_TITLE': (state, { playlistTitle }) => ({
        ...state,
        playlistTitle
    }),

    'playlist/UPDATE_ITEMS': (
        { items, ...state },
        { items: newItems, nextPageToken = '', totalResults }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlist/REMOVE_ITEM': (state, { playlistItemId }) => {
        const items = state.items.filter(
            (item) => item.playlistItemId !== playlistItemId
        );

        return { ...state, items, totalResults: items.length };
    },

    'playlist/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
