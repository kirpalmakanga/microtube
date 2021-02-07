import { useCallback } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';
import * as api from '../../api/youtube';
import { usePlayer } from './player';
import { usePrompt } from './prompt';

/* TODO: hook up usePlaylistItems, usePrompt */

export const usePlaylists = (channelId?: string) => {
    const [
        {
            playlists,
            player: { queue }
        },
        dispatch
    ] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { setActiveQueueItem, queueItems }] = usePlayer();
    const [, { openPrompt }] = usePrompt();

    /* TODO: déclarer les callbacks puis les retourner */

    const queuePlaylist = useCallback(
        async ({ id: playlistId, ...data }, play) => {
            console.log({ playlistId, data });
            const getItems = async (pageToken?: string) => {
                const { items, nextPageToken } = await api.getPlaylistItems({
                    playlistId,
                    pageToken
                });

                const newItems = queueItems(items);

                if (play && !pageToken && newItems.length) {
                    const [{ id }] = newItems;

                    setActiveQueueItem(id);
                }

                if (nextPageToken) {
                    await getItems(nextPageToken);
                }
            };

            try {
                await getItems();
            } catch (error) {
                openNotification('Error queueing playlist items.');
            }
        },
        [channelId, playlists]
    );

    const getPlaylists = useCallback(async () => {
        try {
            const { nextPageToken: pageToken, hasNextPage } = playlists;

            if (!hasNextPage) {
                return;
            }

            const payload = await api.getPlaylists({
                ...(channelId ? { channelId } : { mine: true }),
                pageToken
            });

            dispatch({ type: 'playlists/UPDATE_ITEMS', payload });
        } catch (error) {
            openNotification('Error fetching playlists.');
        }
    }, [playlists]);

    return [
        playlists,
        {
            getPlaylists,

            // clearPlaylists: useCallback(
            //     () => dispatch({ type: 'playlists/CLEAR_ITEMS' }),
            //     [channelId, playlists]
            // ),

            createPlaylist: useCallback(
                async (params) => {
                    try {
                        const payload = await api.createPlaylist(params);

                        dispatch({ type: 'playlists/ADD_ITEM', payload });

                        return payload;
                    } catch (error) {
                        const { title } = params;

                        openNotification(`Error creating playlist "${title}".`);
                    }
                },
                [channelId, playlists]
            ),

            removePlaylist: useCallback(
                ({ id: playlistId, title }) => {
                    openPrompt({
                        headerText: `Remove playlist ${title} ?`,
                        confirmText: 'Remove',
                        callback: async () => {
                            try {
                                dispatch({
                                    type: 'playlists/REMOVE_ITEM',
                                    payload: { playlistId }
                                });

                                openNotification(
                                    `Removed playlist "${title}".`
                                );

                                await api.removePlaylist(playlistId);
                            } catch (error) {
                                openNotification('Error deleting playlist.');
                            }
                        }
                    });
                },
                [channelId, playlists]
            ),

            queuePlaylist,

            launchPlaylist: useCallback((data) => queuePlaylist(data, true), [
                channelId,
                playlists
            ])
        }
    ];
};
