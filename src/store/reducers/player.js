import { createReducer } from '../helpers';

const initialState = {
    queue: [],
    currentId: '',
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    video: { title: 'No video.', id: '', duration: 0 }
};

const isActiveItem = (videoId) => ({ id }) => id === videoId;

const extractQueueItemData = ({ id, title, description, duration }) => ({
    id,
    title,
    description,
    duration
});

export default createReducer(initialState, {
    'player/UPDATE_DATA': (state, data) => ({
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
        { queue, currentId, ...state },
        { videoId }
    ) => {
        return {
            ...state,
            queue: queue.filter(({ id }) => id !== videoId),
            currentId: currentId === videoId ? '' : currentId
        };
    },

    'player/CLEAR_QUEUE': (
        { queue, currentId, ...state },
        { clearAll = false }
    ) => ({
        ...state,
        queue: clearAll
            ? initialState.queue
            : queue.filter(isActiveItem(currentId)),
        currentId
    }),

    'player/CLEAR_VIDEO': (state) => ({ ...state, video: initialState.video })
});
