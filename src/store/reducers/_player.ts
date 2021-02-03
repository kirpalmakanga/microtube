import { createReducer, State } from '../helpers';

interface QueueItem {
    id: string;
    title: string;
    description: string;
    duration: number;
}

export interface PlayerState extends State {
    queue: QueueItem[];
    currentId: string;
    showQueue: boolean;
    showScreen: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: QueueItem;
}

export const initialState: PlayerState = {
    queue: [],
    currentId: '',
    showQueue: false,
    showScreen: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    video: {
        id: '',
        title: 'No video.',
        description: '',
        duration: 0
    }
};

const isActiveItem = (videoId: string) => ({ id }: QueueItem) => id === videoId;

const extractQueueItemData = ({
    id,
    title,
    description,
    duration
}: any): QueueItem => ({
    id,
    title,
    description,
    duration
});

export default createReducer(initialState, {
    'player/UPDATE_DATA': (state: State, data: State) => ({
        ...state,
        ...data
    }),

    'player/ADD_QUEUE_ITEMS': (
        { queue, showQueue, newQueueItems, ...state }: State,
        { items = [] }: State
    ) => ({
        ...state,
        queue: [...queue, ...items.map(extractQueueItemData)],
        newQueueItems: !showQueue ? newQueueItems + items.length : 0,
        showQueue
    }),

    'player/REMOVE_QUEUE_ITEM': (
        { queue, currentId, ...state }: State,
        { videoId }: State
    ) => {
        return {
            ...state,
            queue: queue.filter(({ id }: QueueItem) => id !== videoId),
            currentId: currentId === videoId ? '' : currentId
        };
    },

    'player/CLEAR_QUEUE': (
        { queue, currentId, ...state }: State,
        { clearAll = false }: State
    ) => ({
        ...state,
        queue: clearAll
            ? initialState.queue
            : queue.filter(isActiveItem(currentId)),
        currentId
    }),

    'player/CLEAR_VIDEO': (state: State) => ({
        ...state,
        video: initialState.video
    }),

    'user/SIGN_OUT': () => ({ ...initialState })
});
