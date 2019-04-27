import { omit } from '../../lib/helpers';
import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    forMine: 0,
    query: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'search/SET_TARGET': (state, { data: { forMine } }) => ({
        ...state,
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
        ...omit(initialState, ['forMine'])
    })
});
