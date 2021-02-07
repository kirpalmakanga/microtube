import { useEffect, useCallback } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';

import { __DEV__ } from '../../config/app';

import * as api from '../../api/youtube';
import database from '../../api/database';

import { splitLines, parseVideoId, chunk } from '../../lib/helpers';

import { QueueItem } from '../reducers/_player';

export const usePlayer = () => {
    const [{ user, player }, dispatch] = useStore();
    const [, openNotification] = useNotifications();

    const getCurrentUserId = useCallback(() => {
        const { id } = user;

        return __DEV__ ? 'dev' : id;
    }, [user]);

    const listenForQueueUpdate = useCallback(() => {
        /* TODO: Prevent useless updates */
        database.listen(
            `users/${getCurrentUserId()}`,
            ({ queue = [], currentId = '' } = {}) =>
                dispatch({
                    type: 'player/UPDATE_DATA',
                    payload: { queue, currentId }
                })
        );
    }, []);

    const setQueue = (queue: QueueItem[]) => {
        dispatch({ type: 'player/UPDATE_DATA', payload: { queue } });
    };

    const queueItems = useCallback((newItems: QueueItem[]) => {
        const { queue } = player;

        const items = newItems.filter(
            ({ id }: QueueItem) =>
                !queue.find(
                    ({ id: queueItemId }: QueueItem) => queueItemId === id
                )
        );

        dispatch({ type: 'player/ADD_QUEUE_ITEMS', payload: { items } });

        return items;
    }, []);

    const queueItem = (data: QueueItem) => queueItems([data]);

    const setActiveQueueItem = useCallback((currentId) => {
        dispatch({
            type: 'player/UPDATE_DATA',
            payload: { currentId }
        });
    }, []);

    const queueVideos = async (ids: string[]) => {
        try {
            const items = await api.getVideosFromIds(ids);

            queueItems(items);
        } catch (error) {}
        openNotification('Error queuing videos.');
    };

    const importVideos = async (text: string) => {
        const lines = splitLines(text).filter(Boolean);

        if (!lines.length) {
            return;
        }

        const videoIds = [...new Set(lines.map(parseVideoId))];

        const chunks = chunk(videoIds, 50);

        for (const ids of chunks) {
            await queueVideos(ids);
        }
    };

    const removeQueueItem = useCallback(({ id }) => {
        console.log({ id });
        dispatch({ type: 'player/REMOVE_QUEUE_ITEM', payload: { id } });
    }, []);

    const clearQueue = () => dispatch({ type: 'player/CLEAR_QUEUE' });

    const clearVideo = () => dispatch({ type: 'player/CLEAR_VIDEO' });

    const setVideo = useCallback(async (videoId) => {
        try {
            clearVideo();

            const video = await api.getVideo(videoId);

            dispatch({ type: 'player/UPDATE_DATA', payload: { video } });
        } catch (error) {
            openNotification('Error fetching video.');
        }
    }, []);

    const toggleQueue = useCallback(() => {
        const { showQueue } = player;

        dispatch({
            type: 'player/UPDATE_DATA',
            payload: {
                showQueue: !showQueue,
                ...(!showQueue ? { showScreen: false, newQueueItems: 0 } : {})
            }
        });
    }, [player]);

    const toggleScreen = useCallback(() => {
        const { showScreen } = player;

        dispatch({
            type: 'player/UPDATE_DATA',
            payload: {
                showScreen: !showScreen,
                ...(!showScreen ? { showQueue: false } : {})
            }
        });
    }, [player]);

    const closeScreen = () =>
        dispatch({
            type: 'player/UPDATE_DATA',
            payload: { showScreen: false }
        });

    const { queue, currentId } = player;

    useEffect(() => {
        database.set(`users/${getCurrentUserId()}`, {
            queue
        });
    }, [queue]);

    useEffect(() => {
        database.set(`users/${getCurrentUserId()}`, {
            currentId
        });
    }, [currentId]);

    return [
        player,
        {
            listenForQueueUpdate,
            setQueue,
            queueItems,
            queueItem,
            setActiveQueueItem,
            importVideos,
            removeQueueItem,
            clearQueue,
            clearVideo,
            setVideo,
            toggleQueue,
            toggleScreen,
            closeScreen
        }
    ];
};
