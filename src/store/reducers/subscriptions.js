import { createReducer } from '../helpers';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: null,
    hasNextPage: true
};

export default createReducer(initialState, {
    'subscriptions/UPDATE_ITEMS': (
        { items, ...state },
        { items: newItems, nextPageToken = '', totalResults }
    ) => ({
        ...state,
        items: [...items, ...newItems],
        nextPageToken,
        hasNextPage: !!nextPageToken,
        totalResults
    }),

    'subscriptions/SUBSCRIBE': (state, { channelId }) => {
        const items = [...state.items];

        const index = items.findIndex(({ id }) => id === channelId);

        if (index > -1) {
            items[index].isUnsubscribed = false;

            return { ...state, items };
        }

        return { ...state };
    },

    'subscriptions/UNSUBSCRIBE': (state, { subscriptionId }) => {
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
