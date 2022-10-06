export interface PlaylistItemsState {
    playlistId: string;
    playlistTitle: string;
    items: PlaylistItemData[];
    nextPageToken: string;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState = (): PlaylistItemsState => ({
    playlistId: '',
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
});
