import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    forMine: 0,
    query: ''
};

export default createReducer(initialState, {
    'search/SET_TARGET': (state, { data: { forMine } }) => ({
        ...state,
        items: initialState.items,
        forMine
    }),

    'search/SET_QUERY': (state, { data: { query } }) => ({ ...state, query }),

    'search/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) => ({
        ...state,
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        hasNextPage: !!nextPageToken,
        totalResults: totalResults || state.totalResults
    }),

    'search/RESET': (state) => ({
        ...state,
        query: initialState.query,
        items: initialState.items,
        nextPageToken: initialState.nextPageToken
    })
});
