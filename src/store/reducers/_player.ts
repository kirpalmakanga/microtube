import { QueueItem } from '../../../@types/alltypes';
import { State } from '../helpers';

export interface PlayerState extends State {
    queue: QueueItem[];
    currentId: string;
    isQueueVisible: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: QueueItem;
}

const initialVideoState = {
    id: '',
    title: 'No video.',
    description: '',
    duration: 0
};

export const initialState: PlayerState = {
    queue: [],
    currentId: '',
    isQueueVisible: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    video: initialVideoState,
    get currentVideo() {
        const { currentId, video, queue } = this;

        return video.id
            ? video
            : queue.find(({ id }) => id === currentId) || initialVideoState;
    }
};
