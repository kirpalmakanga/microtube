import { createReducer, State } from '../helpers';
import { omit } from '../../lib/helpers';

interface SearchState extends State {
    items: object[];
    nextPageToken: string;
    hasNextPage: boolean;
    forMine: number;
    totalResults: number | null;
}

export const initialState: SearchState = {
    items: [],
    nextPageToken: '',
    hasNextPage: true,
    forMine: 0,
    totalResults: null
};

export default createReducer(initialState, {
    'search/SET_TARGET': (state: State, { forMine }: State) => ({
        ...state,
        forMine
    }),

    'search/UPDATE_ITEMS': (
        { items, ...state }: State,
        { items: newItems, nextPageToken = '', totalResults }: State
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'search/RESET': (state: State) => ({
        ...state,
        ...omit(initialState, ['forMine'])
    }),

    'user/SIGN_OUT': () => ({ ...initialState })
});
