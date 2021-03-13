import { useEffect, useCallback } from 'react';
import isEqual from 'lodash/isEqual';

import { useStore } from '..';
import { useNotifications } from './notifications';
import { usePrompt } from './prompt';

import { QueueItem } from '../../../@types/alltypes';

import { __DEV__ } from '../../config/app';

import * as api from '../../api/youtube';
import database from '../../api/database';

import { splitLines, parseVideoId, chunk } from '../../lib/helpers';
import { Action, Dispatch, GetState } from '../helpers';

export const usePlayer = () => {
    const [{ user, player }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getCurrentUserId = useCallback(() => {
        const { id } = user;

        return __DEV__ ? 'dev' : id;
    }, [user]);

    const subscribeToQueue = useCallback(() => {
        const path = `users/${getCurrentUserId()}/queue`;

        const unsubscribePromise = database.subscribe(path, (queue = []) => {
            dispatch((_: Dispatch<Action>, getState: GetState) => {
                const {
                    player: { queue: previousQueue }
                } = getState();

                if (!isEqual(queue, previousQueue)) {
                    dispatch({
                        type: 'player/UPDATE_DATA',
                        payload: { queue }
                    });
                }
            });
        });

        return async () => (await unsubscribePromise)();
    }, []);

    const subscribeToCurrentQueueId = useCallback(() => {
        const path = `users/${getCurrentUserId()}/currentId`;

        const unsubscribePromise = database.subscribe(
            path,
            (currentId = '') => {
                dispatch((_: Dispatch<Action>, getState: GetState) => {
                    const {
                        player: { currentId: previousCurrentId }
                    } = getState();

                    if (currentId !== previousCurrentId) {
                        dispatch({
                            type: 'player/UPDATE_DATA',
                            payload: { currentId }
                        });
                    }
                });
            }
        );

        return async () => (await unsubscribePromise)();
    }, []);

    const setQueue = (queue: QueueItem[]) =>
        dispatch({ type: 'player/UPDATE_DATA', payload: { queue } });

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
        } catch (error) {
            openNotification('Error queuing videos.');
        }
    };

    const importVideos = () =>
        openPrompt({
            mode: 'import',
            headerText: 'Import videos',
            confirmText: 'Import',
            callback: async (text: string) => {
                const lines = splitLines(text).filter(Boolean);

                if (lines.length) {
                    const videoIds = [...new Set(lines.map(parseVideoId))];

                    const chunks = chunk(videoIds, 50);

                    for (const ids of chunks) {
                        await queueVideos(ids);
                    }
                }
            }
        });

    const removeQueueItem = useCallback(
        ({ id }) =>
            dispatch({ type: 'player/REMOVE_QUEUE_ITEM', payload: { id } }),
        []
    );

    const clearNewQueueItems = () =>
        dispatch({
            type: 'player/UPDATE_DATA',
            payload: { newQueueItems: 0 }
        });

    const clearQueue = useCallback(
        () =>
            openPrompt({
                headerText: 'Clear queue ?',
                confirmText: 'Clear',
                cancelText: 'Cancel',
                callback: () => dispatch({ type: 'player/CLEAR_QUEUE' })
            }),
        []
    );

    const clearVideo = () => dispatch({ type: 'player/CLEAR_VIDEO' });

    const getVideo = useCallback(async (videoId) => {
        try {
            clearVideo();

            const video = await api.getVideo(videoId);

            dispatch({ type: 'player/SET_VIDEO', payload: { video } });
        } catch (error) {
            openNotification('Error fetching video.');
        }
    }, []);

    const toggleQueue = () =>
        dispatch((_: Dispatch<Action>, getState: GetState) => {
            const {
                player: { isQueueVisible: currentIsQueueVisible }
            } = getState();

            const isQueueVisible = !currentIsQueueVisible;

            dispatch({
                type: 'player/UPDATE_DATA',
                payload: {
                    isQueueVisible,
                    ...(!isQueueVisible
                        ? { isScreenVisible: false, newQueueItems: 0 }
                        : {})
                }
            });
        });

    const closeScreen = () =>
        dispatch({
            type: 'player/UPDATE_DATA',
            payload: { isScreenVisible: false }
        });

    const { queue, currentId } = player;

    const goToNextQueueItem = (next: boolean | undefined = true) =>
        dispatch((_: Dispatch<Action>, getState: GetState) => {
            const {
                player: { queue, currentId }
            } = getState();
            const currentQueueIndex = queue.findIndex(
                ({ id }: QueueItem) => id === currentId
            );
            const newIndex = currentQueueIndex + (next ? 1 : -1);
            const { [newIndex]: { id = null } = {} } = queue;

            if (id) {
                setActiveQueueItem(id);
            }

            return !!id;
        });

    useEffect(() => {
        database.set(`users/${getCurrentUserId()}/queue`, queue);
    }, [queue]);

    useEffect(() => {
        database.set(`users/${getCurrentUserId()}/currentId`, currentId);
    }, [currentId]);

    return [
        player,
        {
            subscribeToQueue,
            subscribeToCurrentQueueId,
            setQueue,
            queueItems,
            queueItem,
            setActiveQueueItem,
            importVideos,
            removeQueueItem,
            clearQueue,
            clearNewQueueItems,
            clearVideo,
            getVideo,
            goToNextQueueItem,
            toggleQueue,
            closeScreen
        }
    ];
};
