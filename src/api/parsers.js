import { parseDuration } from '../lib/helpers';

export const parseVideoData = ({
    id,
    contentDetails: { duration = '' } = {},
    snippet: { title, thumbnails, channelId, channelTitle, publishedAt } = {},
    status: { privacyStatus = 'deleted' } = {}
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
    contentDetails: { itemCount = 0 } = {},
    snippet: { title, thumbnails },
    status: { privacyStatus }
}) => ({
    id,
    title,
    thumbnails,
    itemCount,
    privacyStatus
});

export const parseChannelData = ({ id, snippet: { title, thumbnails } }) => ({
    id,
    title,
    thumbnails
});
