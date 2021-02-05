import { useCallback } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';

import { __DEV__ } from '../../config/app';

import * as api from '../../api/youtube';
import database from '../../api/database';

import { QueueItem } from '../reducers/_player';

export const usePlayer = () => {
    const [{ user, player }, dispatch] = useStore();
    const [_, openNotification] = useNotifications();

    const getCurrentUserId = useCallback(() => {
        const { id } = user;

        return __DEV__ ? 'dev' : id;
    }, [user]);

    const saveQueue = useCallback(() => {
        const { isSignedIn } = user;
        const { queue, currentId } = player;

        if (isSignedIn) {
            database.set(`users/${getCurrentUserId()}`, {
                queue,
                currentId
            });
        }
    }, [user, player]);

    const listenForQueueUpdate = useCallback(() => {
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

        saveQueue();
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

        saveQueue();

        return items;
    }, []);

    const setActiveQueueItem = useCallback(
        (currentId) => () => {
            dispatch({
                type: 'player/UPDATE_DATA',
                payload: { currentId }
            });

            saveQueue();
        },
        []
    );

    const clearVideo = () => dispatch({ type: 'player/CLEAR_VIDEO' });

    const setVideo = useCallback(async (videoId) => {
        try {
            clearVideo();

            const video = await api.getVideo(videoId);

            dispatch({ type: 'player/UPDATE_DATA', payload: { video } });
        } catch (error) {
            openNotification({ message: 'Error fetching video.' });
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

    return [
        player,
        {
            listenForQueueUpdate,
            setQueue,
            queueItems,
            setActiveQueueItem,
            clearVideo,
            setVideo,
            toggleQueue,
            toggleScreen,
            closeScreen
        }
    ];
};
