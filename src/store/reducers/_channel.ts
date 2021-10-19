import { createReducer, State } from '../helpers';
import { omit } from '../../lib/helpers';

export interface ChannelVideosState {
    items: object[];
    nextPageToken: string;
    hasNextPage: boolean;
    totalResults: number | null;
}
export interface ChannelPlaylistsState {
    items: object[];
    nextPageToken: string;
    hasNextPage: boolean;
    totalResults: number | null;
}
export interface ChannelState {
    [key: string]: unknown;
    channelTitle: string;
    description: string;
    thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
    };
    videos: ChannelVideosState;
    playlists: ChannelPlaylistsState;
}

export const initialState: ChannelState = {
    channelTitle: '',
    description: '',
    thumbnails: {
        default: { url: '' },
        medium: { url: '' },
        high: { url: '' }
    },
    videos: {
        items: [],
        nextPageToken: '',
        hasNextPage: true,
        totalResults: null
    },
    playlists: {
        items: [],
        nextPageToken: '',
        hasNextPage: true,
        totalResults: null
    }
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
