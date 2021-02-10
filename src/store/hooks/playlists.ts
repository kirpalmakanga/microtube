import { useCallback, useEffect } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';
import * as api from '../../api/youtube';
import { usePlayer } from './player';
import { usePrompt } from './prompt';
import { PlaylistData } from '../../../@types/alltypes';
import { Action, Dispatch, GetState } from '../helpers';

export const usePlaylists = (channelId?: string) => {
    const [{ playlists }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { setActiveQueueItem, queueItems }] = usePlayer();
    const [, { openPrompt }] = usePrompt();

    const queuePlaylist = async (
        { id: playlistId }: PlaylistData,
        play: boolean
    ) => {
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
    };

    const launchPlaylist = (data: PlaylistData) => queuePlaylist(data, true);

    const getPlaylists = () =>
        dispatch(async (dispatch: Dispatch<Action>, getState: GetState) => {
            try {
                const {
                    playlists: { nextPageToken: pageToken, hasNextPage }
                } = getState();

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
        });

    const createPlaylist = async (title: string, privacyStatus: string) => {
        try {
            const playlist = await api.createPlaylist({ title, privacyStatus });

            dispatch({ type: 'playlists/ADD_ITEM', payload: { playlist } });

            return playlist;
        } catch (error) {
            openNotification(`Error creating playlist "${title}".`);
        }
    };

    const removePlaylist = ({ id, title }: PlaylistData) => {
        openPrompt({
            headerText: `Remove playlist ${title} ?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            callback: async () => {
                try {
                    dispatch({
                        type: 'playlists/REMOVE_ITEM',
                        payload: { id }
                    });

                    openNotification(`Removed playlist "${title}".`);

                    await api.removePlaylist(id);
                } catch (error) {
                    openNotification('Error deleting playlist.');
                }
            }
        });
    };

    const clearPlaylists = () => dispatch({ type: 'playlists/CLEAR_ITEMS' });

    useEffect(() => clearPlaylists, [channelId]);

    return [
        playlists,
        {
            getPlaylists,
            clearPlaylists,
            createPlaylist,
            removePlaylist,
            queuePlaylist,
            launchPlaylist
        }
    ];
};
