import { createReducer } from '../helpers.js';

const initialState = {
    queue: [],
    currentIndex: -1,
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0
};

const setActiveItem = (index) => (item, i) => ({
    ...item,
    active: i === index ? true : false
});

const isActiveItem = (item) => item.active;

export default createReducer(initialState, {
    SCREEN_OPEN: (state) => ({ ...state, showScreen: true, showQueue: false }),

    SCREEN_CLOSE: (state) => ({ ...state, showScreen: false }),

    QUEUE_OPEN: (state) => ({
        ...state,
        showQueue: true,
        showScreen: false,
        newQueueItems: 0
    }),

    QUEUE_CLOSE: (state) => ({ ...state, showQueue: false }),

    QUEUE_PUSH: (state, { items }) => ({
        ...state,
        queue: [...state.queue, ...items],
        newQueueItems: (state.newQueueItems += items.length)
    }),

    QUEUE_REMOVE: (
        { queue: currentQueue, currentIndex, ...state },
        { data: index }
    ) => {
        const queue = currentQueue.filter(({}, i) => i !== index);

        return {
            ...state,
            queue,
            currentIndex:
                index === currentIndex
                    ? initialState.currentIndex
                    : currentIndex
        };
    },

    QUEUE_CLEAR: (state) => ({
        ...state,
        queue: state.queue.filter(isActiveItem)
    }),

    QUEUE_SET: (state, { data: queue }) => ({ ...state, queue }),

    QUEUE_SET_ACTIVE_ITEM: (state, { data: { index } = {} }) => {
        const { queue } = state;
        const currentIndex = !isNaN(index) ? index : queue.length - 1;

        return {
            ...state,
            queue: queue.map(setActiveItem(currentIndex)),
            currentIndex
        };
    },

    SET_VOLUME: (state, { data }) => ({ ...state, volume: data }),

    SET_CURRENT_TIME: (state, { data }) => ({ ...state, currentTime: data })
});
