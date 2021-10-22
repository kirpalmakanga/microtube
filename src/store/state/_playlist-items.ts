export interface PlaylistItem {
    playlistItemId: string;
}

export interface PlaylistItemsState {
    playlistTitle: string;
    items: PlaylistItem[];
    nextPageToken: string;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState = (): PlaylistItemsState => ({
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
});
