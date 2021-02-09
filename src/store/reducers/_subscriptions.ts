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

    'subscriptions/SUBSCRIBE': (
        { items: storedItems, ...state }: State,
        { channelId }: State
    ) => {
        const items = [...storedItems];

        const index = items.findIndex(({ id }) => id === channelId);

        if (index > -1) {
            items[index].isUnsubscribed = false;
        }

        return { ...state, items };
    },

    'subscriptions/UNSUBSCRIBE': (
        { items: storedItems, ...state }: State,
        { subscriptionId }: State
    ) => {
        const items = [...storedItems];

        const index = items.findIndex(
            (item) => item.subscriptionId === subscriptionId
        );

        if (index > -1) {
            items[index].isUnsubscribed = true;
        }

        return { ...state, items };
    },

    'subscriptions/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
