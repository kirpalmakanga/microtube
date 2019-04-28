import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

const matchPlaylistId = (playlistId) => ({ id }) => id === playlistId;

const findPlaylistIndex = (playlistId = '', items = []) =>
    items.findIndex(matchPlaylistId(playlistId));

const updateItem = (playlistId = '', items = [], callback = () => {}) => {
    const index = findPlaylistIndex(playlistId, items);

    if (index > -1) {
        callback(items[index]);
    }
};

export default createReducer(initialState, {
    'playlists/UPDATE_ITEMS': (
        { items, ...state },
        { data: { items: newItems, nextPageToken = '', totalResults } }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlists/UPDATE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        updateItem(playlistId, items, (item) => item.itemCount++);

        return { ...state, items };
    },

    'playlists/REMOVE_ITEM': (state, { data: { playlistId } }) => ({
        ...state,
        items: state.items.filter((item) => item.id !== playlistId)
    }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        updateItem(playlistId, items, (item) => item.itemCount++);

        return { ...state, items };
    },

    'playlists/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
