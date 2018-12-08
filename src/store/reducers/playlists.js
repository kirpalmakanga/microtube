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

    'playlists/UPDATE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === playlistId);

        if (index > -1) {
            items[index].itemCount++;

            return updateObject(state, { items });
        }
        return { ...state };
    },

    'playlists/REMOVE_ITEM': (state, { data: { playlistId } }) =>
        updateObject(state, {
            items: state.items.filter((item) => item.id !== playlistId)
        }),

    'playlist/REMOVE_ITEM': (state, { data: { playlistId } }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === playlistId);

        if (index > -1) {
            items[index].itemCount--;

            return updateObject(state, { items });
        }
        return { ...state };
    },

    'auth/SIGN_OUT': () => initialState
});
