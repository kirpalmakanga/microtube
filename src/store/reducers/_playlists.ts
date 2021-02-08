import { PlaylistData } from '../../../@types/alltypes';
import { createReducer, State } from '../helpers';

interface PlaylistsState extends State {
    items: PlaylistData[];
    nextPageToken: '';
    totalResults: null;
    hasNextPage: true;
}

export const initialState: PlaylistsState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

const updateItem = (
    playlistId: string,
    items: PlaylistData[],
    update: (data: PlaylistData) => PlaylistData
) => {
    const index = items.findIndex(({ id }: PlaylistData) => id === playlistId);

    if (index > -1) {
        items[index] = update(items[index]);
    }
};

export default createReducer(initialState, {
    'playlists/UPDATE_ITEMS': (
        { items, ...state }: State,
        { items: newItems, nextPageToken = '', totalResults }: State
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlists/ADD_ITEM': (
        { items, ...state }: State,
        { playlist }: State
    ) => ({
        ...state,
        items: [playlist, ...items]
    }),

    'playlists/UPDATE_ITEM': (
        { items: currentItems, ...state }: State,
        { playlist: { id, ...data } }: State
    ) => {
        const items = [...currentItems];

        updateItem(id, items, (item) => ({
            ...item,
            ...data
        }));

        return { ...state, items };
    },

    'playlists/REMOVE_ITEM': (state: State, { id }: State) => ({
        ...state,
        items: state.items.filter(
            ({ id: itemId }: PlaylistData) => itemId !== id
        )
    }),

    'playlist/REMOVE_ITEM': (state: State, { playlistId }: State) => {
        const items = [...state.items];

        updateItem(playlistId, items, ({ itemCount, ...item }) => ({
            ...item,
            itemCount: itemCount > 0 ? itemCount - 1 : itemCount
        }));

        return { ...state, items };
    },

    'playlists/CLEAR_ITEMS': () => ({ ...initialState }),

    'user/SIGN_OUT': () => ({ ...initialState })
});
