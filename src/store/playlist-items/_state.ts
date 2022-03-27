import { PlaylistItemData } from '../../../@types/alltypes';

export interface PlaylistItemsState {
    playlistTitle: string;
    items: PlaylistItemData[];
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
