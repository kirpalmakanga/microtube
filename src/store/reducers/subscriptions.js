import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

export default createReducer(initialState, {
    'subscriptions/UPDATE_ITEMS': (
        { items, ...state },
        { data: { items: newItems, nextPageToken = '', totalResults } }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'subscriptions/SUBSCRIBE': (state, { data: { channelId } }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === channelId);

        if (index > -1) {
            items[index].isUnsubscribed = false;

            return { ...state, items };
        }

        return { ...state };
    },

    'subscriptions/UNSUBSCRIBE': (state, { data: { subscriptionId } }) => {
        const items = [...state.items];

        const index = items.findIndex(
            (item) => item.subscriptionId === subscriptionId
        );

        if (index > -1) {
            items[index].isUnsubscribed = true;

            return { ...state, items };
        }

        return { ...state };
    },

    'subscriptions/CLEAR_ITEMS': () => ({ ...initialState }),

    'auth/SIGN_OUT': () => ({ ...initialState })
});
