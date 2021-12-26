import * as api from '../../api/youtube';

import { useStore } from '..';
import { useNotifications } from '../notifications';
import { usePrompt } from '../prompt';
import { initialState } from './_state';

export const useChannel = (channelId: string) => {
    const [{ channel }, setState] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getData = async () => {
        try {
            const data = await api.getChannel(channelId);

            setState('channel', data);
        } catch (error) {
            openNotification('Error fetching channel data.');
        }
    };

    const getPlaylists = async () => {
        try {
            const {
                items,
                nextPageToken: pageToken,
                hasNextPage
            } = channel.playlists;

            if (hasNextPage) {
                const {
                    items: newItems,
                    nextPageToken = '',
                    totalResults
                } = await api.getPlaylists({
                    ...(channelId ? { channelId } : { mine: true }),
                    pageToken
                });

                setState('channel', {
                    playlists: {
                        items: [...items, ...newItems],
                        nextPageToken,
                        hasNextPage: !!nextPageToken,
                        totalResults
                    }
                });
            }
        } catch (error) {
            console.error(error);
            openNotification('Error fetching playlists.');
        }
    };

    const getVideos = async () => {
        try {
            const {
                videos: { items, nextPageToken: pageToken, hasNextPage }
            } = channel;

            if (hasNextPage) {
                const {
                    items: newItems,
                    nextPageToken = '',
                    totalResults
                } = await api.getChannelVideos({
                    channelId,
                    pageToken
                });

                setState('channel', {
                    videos: {
                        items: [...items, ...newItems],
                        nextPageToken,
                        hasNextPage: !!nextPageToken,
                        totalResults
                    }
                });
            }
        } catch (error) {
            openNotification('Error fetching channel videos.');
        }
    };

    const clearData = () => setState('channel', initialState());

    const toggleSubscription = async () => {
        const { channelTitle, subscriptionId } = channel;

        if (subscriptionId) {
            openPrompt({
                headerText: `Unsubscribe from ${channelTitle}`,
                confirmText: 'OK',
                cancelText: 'Cancel',
                async callback() {
                    try {
                        setState('channel', { subscriptionId: '' });

                        await api.unsubscribeFromChannel(subscriptionId);
                    } catch (error) {
                        openNotification('Error unsubscribing to channel.');
                    }
                }
            });
        } else {
            try {
                const subscriptionId = await api.subscribeToChannel(channelId);

                setState('channel', { subscriptionId });
            } catch (error) {
                openNotification('Error subscribing to channel.');
            }
        }
    };

    return [
        channel,
        {
            getData,
            clearData,
            getVideos,
            getPlaylists,
            toggleSubscription
        }
    ];
};
