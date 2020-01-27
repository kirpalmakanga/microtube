import { createReducer } from '../helpers.js';

const initialState = {
    queue: [],
    currentIndex: 0,
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    video: { title: 'No video.', id: '', duration: 0 }
};

const isActiveItem = (currentIndex) => (_, index) => index === currentIndex;

const extractQueueItemData = ({ id, title, duration }) => ({
    id,
    title,
    duration
});

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

    'player/QUEUE_PUSH': (
        { queue, showQueue, newQueueItems, ...state },
        { items = [] }
    ) => ({
        ...state,
        queue: [...queue, ...items.map(extractQueueItemData)],
        newQueueItems: !showQueue ? newQueueItems + items.length : 0,
        showQueue
    }),

    'player/REMOVE_QUEUE_ITEM': (
        { queue, currentIndex, ...state },
        { data: { videoId } = {} }
    ) => {
        const index = queue.findIndex(({ id }) => id === videoId);

        return {
            ...state,
            queue: queue.filter((_, i) => i !== index),
            currentIndex:
                index === currentIndex
                    ? initialState.currentIndex
                    : currentIndex
        };
    },

    'player/CLEAR_QUEUE': ({ queue, currentIndex, ...state }) => ({
        ...state,
        queue: queue.filter(isActiveItem(currentIndex)),
        currentIndex: initialState.currentIndex
    }),

    'player/UPDATE_QUEUE': (state, { data: { queue = [] } = {} }) => ({
        ...state,
        queue
    }),

    'player/SET_ACTIVE_QUEUE_ITEM': (state, { data: { index } = {} }) => {
        const currentIndex = !isNaN(index) ? index : state.queue.length - 1;

        return {
            ...state,
            currentIndex
        };
    },

    'player/SET_VIDEO': (state, { data: { video } = {} }) => ({
        ...state,
        video
    }),

    'player/CLEAR_VIDEO': (state) => ({ ...state, video: initialState.video }),

    'player/SET_VOLUME': (state, { data }) => ({ ...state, volume: data }),

    'player/SET_CURRENT_TIME': (state, { data }) => ({
        ...state,
        currentTime: data
    })
});
