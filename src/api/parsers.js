import { parseDuration } from '../lib/helpers';

export const parseVideoData = ({
    id,
    contentDetails: { duration },
    snippet: { title, thumbnails, channelId, channelTitle, publishedAt },
    status: { privacyStatus }
}) => ({
    id,
    title,
    thumbnails,
    duration: parseDuration(duration),
    publishedAt,
    channelId,
    channelTitle,
    privacyStatus
});

export const parsePlaylistData = ({
    id,
    contentDetails: { itemCount },
    snippet: { title, thumbnails },
    status: { privacyStatus }
}) => ({
    id,
    title,
    thumbnails,
    itemCount,
    privacyStatus
});
