import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    forMine: 0,
    query: ''
};

export default createReducer(initialState, {
    'search/SET_TARGET': (state, { data: { forMine } }) =>
        updateObject(state, { items: initialState.items, forMine }),

    'search/SET_QUERY': (state, { data: { query } }) =>
        updateObject(state, { query }),

    'search/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) =>
        updateObject(state, {
            items: [...state.items, ...items],
            nextPageToken: nextPageToken || null,
            totalResults
        }),

    'search/RESET': (state) =>
        updateObject(state, {
            items: initialState.items,
            nextPageToken: initialState.nextPageToken
        })
});
