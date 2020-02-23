import { createReducer } from '../helpers';

const initialState = {
    queue: [],
    currentIndex: 0,
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    loaded: 0,
    video: { title: 'No video.', id: '', duration: 0 }
};

const isActiveItem = (currentIndex) => (_, index) => index === currentIndex;

const extractQueueItemData = ({ id, title, duration }) => ({
    id,
    title,
    duration
});

export default createReducer(initialState, {
    'player/UPDATE_DATA': (state, { data = {} }) => ({
        ...state,
        ...data
    }),

    'player/ADD_QUEUE_ITEMS': (
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

    'player/SET_ACTIVE_QUEUE_ITEM': (state, { data: { index } = {} }) => {
        const currentIndex = !isNaN(index) ? index : state.queue.length - 1;

        return {
            ...state,
            currentIndex
        };
    },

    'player/CLEAR_QUEUE': (
        { queue, currentIndex, ...state },
        { data: { clearAll = false } = {} }
    ) => ({
        ...state,
        queue: clearAll
            ? initialState.queue
            : queue.filter(isActiveItem(currentIndex)),
        currentIndex: initialState.currentIndex
    }),

    'player/CLEAR_VIDEO': (state) => ({ ...state, video: initialState.video })
});
