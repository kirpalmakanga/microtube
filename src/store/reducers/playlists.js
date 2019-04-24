import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: 0,
    hasNextPage: true
};

export default createReducer(initialState, {
    'playlists/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) => ({
        ...state,
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlists/UPDATE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === playlistId);

        if (index > -1) {
            items[index].itemCount++;

            return { ...state, items };
        }
        return { ...state };
    },

    'playlists/REMOVE_ITEM': (state, { data: { playlistId } }) => ({
        ...state,
        items: state.items.filter((item) => item.id !== playlistId)
    }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === playlistId);

        if (index > -1) {
            items[index].itemCount--;

            return { ...state, items };
        }
        return { ...state };
    },

    'playlists/CLEAR_ITEMS': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
