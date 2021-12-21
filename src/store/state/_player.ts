import { QueueItem } from '../../../@types/alltypes';

export interface PlayerState {
    queue: QueueItem[];
    currentId: string;
    isQueueVisible: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: QueueItem;
    currentVideo: QueueItem;
}

const initialVideoState = {
    id: '',
    title: 'No video.',
    description: '',
    duration: 0
};

export const initialState = (): PlayerState => ({
    queue: [],
    currentId: '',
    isQueueVisible: false,
    volume: 100,
    newQueueItems: 0,
    currentTime: 0,
    video: initialVideoState,
    get currentVideo() {
        const { currentId, video, queue } = this;

        if (video.id) return video;

        return queue.find(({ id }) => id === currentId) || initialVideoState;
    }
});
