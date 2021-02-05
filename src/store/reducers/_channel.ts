import { createReducer, State } from '../helpers';
import { omit } from '../../lib/helpers';

interface ChannelState {
    [key: string]: unknown;
    channelTitle: string;
    description: string;
    thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
    };
    items: object[];
    nextPageToken: string;
    hasNextPage: true;
    totalResults: null;
}

export const initialState: ChannelState = {
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
    'channel/UPDATE_DATA': (state: State, data: State) => ({
        ...state,
        ...data
    }),

    'channel/UPDATE_ITEMS': (
        { items, ...state }: State,
        { items: newItems, nextPageToken = '', totalResults }: State
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'channel/CLEAR_ITEMS': (state: State) => ({
        ...state,
        ...omit(initialState, ['channelTitle', 'description', 'thumbnails'])
    }),

    'channel/CLEAR_DATA': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
