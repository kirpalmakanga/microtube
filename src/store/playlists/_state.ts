import { PlaylistData } from '../../../@types/alltypes';

export interface PlaylistsState {
    items: PlaylistData[];
    nextPageToken: string;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState = (): PlaylistsState => ({
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
});
