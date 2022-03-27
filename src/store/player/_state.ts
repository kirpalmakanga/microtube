import { VideoData } from '../../../@types/alltypes';

export interface PlayerState {
    queue: VideoData[];
    currentId: string;
    isScreenVisible: boolean;
    volume: number;
    newQueueItems: number;
    currentTime: number;
    video: VideoData;
    currentVideo: VideoData;
}

const initialVideoState: VideoData = {
    id: '',
    title: 'No video.',
    description: '',
    duration: 0,
    thumbnails: {
        medium: { url: '' },
        default: { url: '' },
        high: { url: '' }
    },
    publishedAt: '',
    channelId: '',
    channelTitle: '',
    privacyStatus: ''
};

export const initialState = (): PlayerState => ({
    queue: [],
    currentId: '',
    isScreenVisible: false,
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
