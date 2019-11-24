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

const updateItem = (playlistId = '', items = [], update = () => {}) => {
    const index = findPlaylistIndex(playlistId, items);

    if (index > -1) {
        items[index] = update(items[index]);
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

    'playlists/ADD_ITEM': ({ items, ...state }, { data }) => ({
        ...state,
        items: [data, ...items]
    }),

    'playlists/UPDATE_ITEM': (
        state,
        { data: { playlistId, thumbnails: newThumbnails, ...data } }
    ) => {
        const items = [...state.items];

        updateItem(playlistId, items, ({ itemCount, thumbnails, ...item }) => ({
            ...item,
            ...data,
            thumbnails: thumbnails || newThumbnails,
            itemCount: itemCount + 1
        }));

        return { ...state, items };
    },

    'playlists/REMOVE_ITEM': (state, { data: { playlistId } }) => ({
        ...state,
        items: state.items.filter((item) => item.id !== playlistId)
    }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        updateItem(playlistId, items, ({ itemCount, ...item }) => ({
            ...item,
            itemCount: itemCount || itemCount - 1
        }));

        return { ...state, items };
    },

    'playlists/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
