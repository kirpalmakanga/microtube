import { createMemo } from 'solid-js';

import { useStore } from '..';
import { useNotifications } from '../notifications';
import { usePrompt } from '../prompt';

import { VideoData } from '../../../@types/alltypes';

import { IS_DEV_MODE } from '../../config/app';

import * as api from '../../api/youtube';
import { saveData, subscribeToData } from '../../api/database';

import { splitLines, parseVideoId, chunk, isEqual } from '../../lib/helpers';
import { initialState } from './_state';

export const usePlayer = () => {
    const [{ user, player }, setState] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getCurrentUserId = () => (IS_DEV_MODE ? 'dev' : user.id);

    const queuePath = `users/${getCurrentUserId()}/queue`;
    const currentIdPath = `users/${getCurrentUserId()}/currentId`;

    const currentQueueIndex = createMemo(
        () =>
            player.queue.findIndex(
                ({ id }: VideoData) => id === player.currentId
            ),
        player.currentId
    );

    const subscribeToQueue = () =>
        subscribeToData(queuePath, (queue = []) => {
            const { queue: currentQueue } = player;

            if (!isEqual(queue, currentQueue)) {
                setState('player', { queue });
            }
        });

    const subscribeToCurrentQueueId = () =>
        subscribeToData(currentIdPath, (currentId = '') => {
            const { currentId: previousCurrentId } = player;

            if (currentId !== previousCurrentId) {
                setState('player', { currentId });
            }
        });

    const setQueue = (queue: VideoData[]) => {
        setState('player', { queue });

        saveData(queuePath, queue);
    };

    const queueItems = (newItems: VideoData[]) => {
        const items = newItems.filter(
            ({ id }: VideoData) =>
                !player.queue.find(
                    ({ id: queueItemId }: VideoData) => queueItemId === id
                )
        );

        const { queue: currentQueue, newQueueItems } = player;

        const queue: VideoData[] = [...currentQueue, ...items];

        setState('player', {
            queue,
            newQueueItems: newQueueItems + items.length
        });

        saveData(queuePath, queue);

        return items;
    };

    const queueItem = (data: VideoData) => queueItems([data]);

    const setActiveQueueItem = (currentId: string) => {
        setState('player', { currentId });

        saveData(currentIdPath, currentId);
    };

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

    const removeQueueItem = ({ id: targetId }: VideoData) => {
        setQueue(player.queue.filter(({ id }: VideoData) => id !== targetId));

        if (targetId === player.currentId) {
            saveData(currentIdPath, '');
        }
    };

    const clearNewQueueItems = () => setState('player', { newQueueItems: 0 });

    const clearQueue = () =>
        openPrompt({
            headerText: 'Clear queue ?',
            confirmText: 'Clear',
            cancelText: 'Cancel',
            callback: () => {
                setQueue(
                    player.queue.filter(
                        ({ id }: VideoData) => id === player.currentId
                    )
                );
            }
        });

    const clearVideo = () =>
        setState('player', { video: initialState().video });

    const getVideo = async (videoId: string) => {
        try {
            clearVideo();

            const video = await api.getVideo(videoId);

            setState('player', { video });
        } catch (error) {
            openNotification('Error fetching video.');
        }
    };

    const setScreenVisibility = (isScreenVisible: boolean) =>
        setState('player', { isScreenVisible });

    const goToNextQueueItem = (next: boolean | undefined = true) => {
        const newIndex = currentQueueIndex() + (next ? 1 : -1);
        const {
            queue: { [newIndex]: { id = null } = {} }
        } = player;

        if (id) setActiveQueueItem(id);
    };

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
            setScreenVisibility
        }
    ] as const;
};
