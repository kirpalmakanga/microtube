import { PlaylistData } from '../../../@types/alltypes';
import { State } from '../helpers';

export interface PlaylistsState extends State {
    items: PlaylistData[];
    nextPageToken: String;
    totalResults: number | null;
    hasNextPage: boolean;
}

export const initialState: PlaylistsState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};
