export const SIZE_DEFAULT = 'default';
export const SIZE_MEDIUM = 'medium';
export const SIZE_HIGH = 'high';

export interface File {
    url: string;
}
export interface ThumbnailsData {
    [key: string]: File;
    [SIZE_DEFAULT]: File;
    [SIZE_MEDIUM]: File;
    [SIZE_HIGH]: File;
}

export type GenericObject = { [key: string]: any };

interface PlaylistData {
    id: string;
    title: string;
    thumbnails: ThumbnailsData;
    itemCount: number;
    privacyStatus: string;
}

interface VideoData {
    id: string;
    title: string;
    description: string;
    thumbnails: ThumbnailsData;
    duration: number;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    privacyStatus: string;
    playlistId?: string;
    playlistItemId?: string;
}

export interface QueueItem {
    id: string;
    title: string;
    description: string;
    duration: number;
}

export interface ChannelData {
    id: string;
}
