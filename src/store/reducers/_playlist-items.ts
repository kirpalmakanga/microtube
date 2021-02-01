import { createReducer, State } from '../helpers';

interface PlaylistItem {
    playlistItemId: string
}

interface PlaylistItemsState extends State {
    playlistTitle: string,
    items: object[],
    nextPageToken: string,
    totalResults: number | null,
    hasNextPage: boolean
};

export const initialState: PlaylistItemsState = {
    playlistTitle: '',
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

export default createReducer(initialState, {
    'playlist/SET_TITLE': (state: State, { playlistTitle }: State) => ({
        ...state,
        playlistTitle
    }),

    'playlist/UPDATE_ITEMS': (
        { items, ...state }: State,
        { items: newItems, nextPageToken = '', totalResults }: State
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'playlist/REMOVE_ITEM': (state: State, { playlistItemId }: State) => {
        const items = state.items.filter(
            ({ playlistItemId: id }: PlaylistItem) => id !== playlistItemId
        );

        return { ...state, items, totalResults: items.length };
    },

    'playlist/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
