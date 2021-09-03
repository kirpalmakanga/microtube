import { createReducer, State } from '../helpers';
import { ChannelData } from '../../../@types/alltypes';

interface SubscriptionsState extends State {
    items: ChannelData[];
    nextPageToken: '';
    totalResults: null;
    hasNextPage: true;
}

export const initialState: SubscriptionsState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

export default createReducer(initialState, {
    'subscriptions/UPDATE_ITEMS': (
        { items, ...state }: State,
        { items: newItems, nextPageToken = '', totalResults }: State
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'subscriptions/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
