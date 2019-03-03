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

    QUEUE_PUSH: (state, { data }) => ({
        ...state,
        queue: [...state.queue, ...(Array.isArray(data) ? data : [data])],
        newQueueItems: (state.newQueueItems += Array.isArray(data)
            ? data.length
            : 1)
    }),

    QUEUE_REMOVE: (state, { data: index }) => ({
        ...state,
        queue: state.queue.filter((item, i) => i !== index)
    }),

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
