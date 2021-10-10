import { PlaylistData } from '../../../@types/alltypes';
import { createReducer, State } from '../helpers';

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

const updateItem = (
    items: PlaylistData[],
    playlistId: string,
    update: (data: PlaylistData) => PlaylistData
) => {
    const index = items.findIndex(({ id }: PlaylistData) => id === playlistId);

    if (index > -1) {
        items[index] = update(items[index]);
    }
};

export default createReducer(initialState, {
    /* TODO: 
        -load channel playlists separately
        -remove playlists cache clearing
        -convert these remainings actions
    */

    'playlists/UPDATE_ITEM': (
        { items: currentItems, ...state }: State,
        { playlist: { id, ...data } }: State
    ) => {
        const items = [...currentItems];

        updateItem(items, id, (item) => ({
            ...item,
            ...data
        }));

        return { ...state, items };
    },

    'playlist/REMOVE_ITEM': (state: State, { playlistId }: State) => {
        const items = [...state.items];

        updateItem(items, playlistId, ({ itemCount, ...item }) => ({
            ...item,
            itemCount: itemCount > 0 ? itemCount - 1 : itemCount
        }));

        return { ...state, items };
    }
});
