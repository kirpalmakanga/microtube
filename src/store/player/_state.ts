import { QueueItemData } from '../../../@types/alltypes';

export interface PlayerState {
    queue: QueueItemData[];
    currentId: string;
    isQueueVisible: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: QueueItemData;
    currentVideo: QueueItemData;
}

const initialVideoState = {
    id: '',
    title: 'No video.',
    description: '',
    duration: 0,
    thumbnails: {
        medium: { url: '' },
        default: { url: '' },
        high: { url: '' }
    },
    icon: ''
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
