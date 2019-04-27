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
    'player/OPEN_SCREEN': (state) => ({
        ...state,
        showScreen: true,
        showQueue: false
    }),

    'player/CLOSE_SCREEN': (state) => ({ ...state, showScreen: false }),

    'player/OPEN_QUEUE': (state) => ({
        ...state,
        showQueue: true,
        showScreen: false,
        newQueueItems: 0
    }),

    'player/CLOSE_QUEUE': (state) => ({ ...state, showQueue: false }),

    'player/QUEUE_PUSH': (state, { items }) => ({
        ...state,
        queue: [...state.queue, ...items],
        newQueueItems: (state.newQueueItems += items.length)
    }),

    'player/REMOVE_QUEUE_ITEM': (
        { queue: currentQueue, currentIndex, ...state },
        { data: index }
    ) => {
        const queue = currentQueue.filter((_, i) => i !== index);

        return {
            ...state,
            queue,
            currentIndex:
                index === currentIndex
                    ? initialState.currentIndex
                    : currentIndex
        };
    },

    'player/CLEAR_QUEUE': (state) => ({
        ...state,
        queue: state.queue.filter(isActiveItem)
    }),

    'player/UPDATE_QUEUE': (state, { data: queue }) => ({ ...state, queue }),

    'player/SET_ACTIVE_QUEUE_ITEM': (state, { data: { index } = {} }) => {
        const { queue } = state;
        const currentIndex = !isNaN(index) ? index : queue.length - 1;

        return {
            ...state,
            queue: queue.map(setActiveItem(currentIndex)),
            currentIndex
        };
    },

    'player/SET_VOLUME': (state, { data }) => ({ ...state, volume: data }),

    'player/SET_CURRENT_TIME': (state, { data }) => ({
        ...state,
        currentTime: data
    })
});
