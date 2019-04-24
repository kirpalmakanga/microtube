import { createReducer } from '../helpers.js';

const initialState = {
    channelTitle: '',
    description: '',
    thumbnails: {
        default: { url: '' },
        medium: { url: '' },
        high: { url: '' }
    },
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    totalResults: 0
};

export default createReducer(initialState, {
    'channel/UPDATE_DATA': (state, { data }) => ({ ...state, ...data }),

    'channel/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) => ({
        ...state,
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'channel/CLEAR_ITEMS': (state) => ({
        ...state,
        items: [],
        nextPageToken: '',
        totalResults: 0
    }),

    'channel/CLEAR_DATA': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
