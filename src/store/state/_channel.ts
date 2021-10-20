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
