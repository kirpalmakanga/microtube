import {
    ChannelData,
    PlaylistData,
    ThumbnailsData,
    VideoData
} from '../../@types/alltypes';
import { parseDuration } from '../lib/helpers';

interface YoutubeVideoData {
    id: string;
    contentDetails: { duration: string };
    snippet: {
        title: string;
        description: string;
        thumbnails: ThumbnailsData;
        channelId: string;
        channelTitle: string;
        publishedAt: string;
    };
    status: { privacyStatus: string };
}

interface YoutubePlaylistData {
    id: string;
    contentDetails: { itemCount: number };
    snippet: { title: string; thumbnails: ThumbnailsData };
    status: { privacyStatus: string };
}

interface YoutubeChannelData {
    id: string;
    snippet: { title: string; thumbnails: ThumbnailsData };
}

export const parseVideoData = ({
    id,
    contentDetails: { duration },
    snippet: {
        title,
        description,
        thumbnails,
        channelId,
        channelTitle,
        publishedAt
    },
    status: { privacyStatus = 'deleted' }
}: YoutubeVideoData): VideoData => ({
    id,
    title,
    description,
    thumbnails,
    duration: parseDuration(duration),
    publishedAt,
    channelId,
    channelTitle,
    privacyStatus
});

export const parsePlaylistData = ({
    id,
    contentDetails: { itemCount = 0 },
    snippet: { title, thumbnails },
    status: { privacyStatus }
}: YoutubePlaylistData): PlaylistData => ({
    id,
    title,
    thumbnails,
    itemCount,
    privacyStatus
});

export const parseChannelData = ({
    id,
    snippet: { title, thumbnails }
}: YoutubeChannelData): ChannelData => ({
    id,
    title,
    thumbnails
});
