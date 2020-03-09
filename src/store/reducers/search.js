import { omit } from '../../lib/helpers';
import { createReducer } from '../helpers';

const initialState = {
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    forMine: 0,
    totalResults: null
};

export default createReducer(initialState, {
    'search/SET_TARGET': (state, { forMine }) => ({
        ...state,
        forMine
    }),

    'search/UPDATE_ITEMS': (
        { items, ...state },
        { items: newItems, nextPageToken = '', totalResults }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'search/RESET': (state) => ({
        ...state,
        ...omit(initialState, ['forMine'])
    })
});
