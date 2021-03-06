import { QueueItem, VideoData } from '../../../@types/alltypes';
import { createReducer, State } from '../helpers';

export interface PlayerState extends State {
    queue: QueueItem[];
    currentId: string;
    isQueueVisible: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: QueueItem;
}

export const initialState: PlayerState = {
    queue: [],
    currentId: '',
    isQueueVisible: false,
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
}: VideoData): QueueItem => ({
    id,
    title,
    description,
    duration
});

export default createReducer(initialState, {
    'player/UPDATE_DATA': (state: State, payload: State) => ({
        ...state,
        ...payload
    }),

    'player/ADD_QUEUE_ITEMS': (
        { queue, isQueueVisible, newQueueItems, ...state }: State,
        { items = [] }: State
    ) => ({
        ...state,
        queue: [...queue, ...items.map(extractQueueItemData)],
        newQueueItems: !isQueueVisible ? newQueueItems + items.length : 0
    }),

    'player/REMOVE_QUEUE_ITEM': (
        { queue, currentId, ...state }: State,
        { id }: State
    ) => ({
        ...state,
        queue: queue.filter(({ id: videoId }: QueueItem) => videoId !== id),
        currentId: currentId === id ? '' : currentId
    }),

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

    'player/SET_VIDEO': (state: State, { video }: State) => ({
        ...state,
        video: extractQueueItemData(video)
    }),

    'player/CLEAR_VIDEO': (state: State) => ({
        ...state,
        video: initialState.video
    }),

    'user/SIGN_OUT': () => ({ ...initialState })
});
