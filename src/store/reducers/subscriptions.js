import { createReducer } from '../helpers.js';

const initialState = {
    items: [],
    nextPageToken: '',
    totalResults: 0
};

export default createReducer(initialState, {
    'subscriptions/UPDATE_ITEMS': (
        state,
        { data: { items, nextPageToken, totalResults } }
    ) => ({
        ...state,
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
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

    'subscriptions/CLEAR_ITEMS': () => initialState,

    'auth/SIGN_OUT': () => initialState
});
