import { omit } from '../../lib/helpers';
import { createReducer } from '../helpers';

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
    totalResults: null
};

export default createReducer(initialState, {
    'channel/UPDATE_DATA': (state, data) => ({ ...state, ...data }),

    'channel/UPDATE_ITEMS': (
        { items, ...state },
        { items: newItems, nextPageToken = '', totalResults }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'channel/CLEAR_ITEMS': (state) => ({
        ...state,
        ...omit(initialState, ['channelTitle', 'description', 'thumbnails'])
    }),

    'channel/CLEAR_DATA': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
