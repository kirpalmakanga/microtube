import { useEffect, useCallback } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';
import * as api from '../../api/youtube';

/* TODO: hook up usePlaylistItems, usePrompt */
const queueItems = (items: object[]) => [];
const setActiveQueueItem = (id: string) => {};

export const usePlaylists = (channelId?: string) => {
    const [
        {
            playlists,
            player: { queue }
        },
        dispatch
    ] = useStore();
    const [_, { openNotification }] = useNotifications();

    const { nextPageToken: pageToken, hasNextPage } = playlists;

    const queuePlaylist = useCallback(
        async ({ id: playlistId }, play) => {
            const getItems = async (pageToken: string) => {
                const { items, nextPageToken } = await api.getPlaylistItems({
                    playlistId,
                    pageToken
                });

                const newItems = queueItems(items);

                if (play && !pageToken && newItems.length) {
                    const [{ id }] = newItems;

                    dispatch(setActiveQueueItem(id));
                }

                if (nextPageToken) {
                    await getItems(nextPageToken);
                }
            };

            try {
                await getItems(pageToken);
            } catch (error) {
                dispatch(
                    openNotification({
                        message: 'Error queueing playlist items.'
                    })
                );
            }
        },
        [channelId, playlists]
    );

    return [
        playlists,
        {
            getPlaylists: useCallback(async () => {
                try {
                    if (!hasNextPage) {
                        return;
                    }

                    const payload = await api.getPlaylists({
                        ...(channelId ? { channelId } : { mine: true }),
                        pageToken
                    });

                    dispatch({ type: 'playlists/UPDATE_ITEMS', payload });
                } catch (error) {
                    dispatch(openNotification('Error fetching playlists.'));
                }
            }, [channelId, playlists]),

            // clearPlaylists: useCallback(
            //     () => dispatch({ type: 'playlists/CLEAR_ITEMS' }),
            //     [channelId, playlists]
            // ),

            createPlaylist: useCallback(
                async (params) => {
                    try {
                        const data = await api.createPlaylist(params);

                        dispatch({ type: 'playlists/ADD_ITEM', data });

                        return data;
                    } catch (error) {
                        const { title } = params;

                        dispatch(
                            openNotification(
                                `Error creating playlist "${title}".`
                            )
                        );
                    }
                },
                [channelId, playlists]
            ),

            removePlaylist: useCallback(
                async ({ id: playlistId, title }) => {
                    try {
                        dispatch({
                            type: 'playlists/REMOVE_ITEM',
                            data: { playlistId }
                        });

                        dispatch(
                            openNotification(`Removed playlist "${title}".`)
                        );

                        await api.removePlaylist(playlistId);
                    } catch (error) {
                        dispatch(openNotification('Error deleting playlist.'));
                    }
                },
                [channelId, playlists]
            ),

            queuePlaylist,

            launchPlaylist: useCallback(({ id }) => queuePlaylist(id, true), [
                channelId,
                playlists
            ])
        }
    ];
};
