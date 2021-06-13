import { useEffect } from 'react';

import { useStore } from '..';
import { usePlaylists } from './playlists';
import { useNotifications } from './notifications';
import { usePrompt } from './prompt';

import { PlaylistData, PlaylistItemData } from '../../../@types/alltypes';

import * as api from '../../api/youtube';
import { Action, Dispatch, GetState } from '../helpers';

export const usePlaylistItems = (playlistId?: string) => {
    const [{ playlistItems }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();
    const [, { createPlaylist }] = usePlaylists();

    const getPlaylistTitle = async (playlistId: string) => {
        const playlistTitle = await api.getPlaylistTitle(playlistId);

        dispatch({
            type: 'playlist/SET_TITLE',
            payload: { playlistTitle }
        });
    };

    const getPlaylistItems = () =>
        dispatch(async (dispatch: Dispatch<Action>, getState: GetState) => {
            try {
                if (!playlistId) {
                    throw new Error('playlistId is required');
                }

                const {
                    playlistItems: { nextPageToken: pageToken, hasNextPage }
                } = getState();

                if (hasNextPage) {
                    const payload = await api.getPlaylistItems({
                        playlistId,
                        pageToken
                    });

                    dispatch({
                        type: 'playlist/UPDATE_ITEMS',
                        payload
                    });
                }
            } catch (error) {
                openNotification('Error fetching playlist items.');
            }
        });

    const addPlaylistItem = async (id: string, playlistId: string) => {
        try {
            await api.addPlaylistItem(playlistId, id);

            const {
                items: [playlist]
            } = await api.getPlaylists({ ids: [playlistId] });

            if (playlist) {
                dispatch({
                    type: 'playlists/UPDATE_ITEM',
                    payload: { playlist }
                });
            }
        } catch (error) {
            openNotification('Error adding playlist item.');
        }
    };

    const editPlaylistItem = ({ id: videoId }: PlaylistItemData) => {
        openPrompt({
            mode: 'playlists',
            headerText: 'Save to playlist',
            confirmText: 'Done',
            callback: async ({
                id: playlistId,
                title,
                privacyStatus
            }: PlaylistData) => {
                try {
                    if (!playlistId) {
                        const { id: newPlaylistId } = await createPlaylist(
                            title,
                            privacyStatus
                        );

                        playlistId = newPlaylistId;
                    }

                    await addPlaylistItem(videoId, playlistId);

                    openNotification(`Added to playlist "${title}".`);
                } catch (error) {
                    openNotification('Error editing playlist item.');
                }
            }
        });
    };

    const removePlaylistItem = ({
        playlistItemId,
        playlistId,
        title
    }: PlaylistItemData) => {
        openPrompt({
            headerText: `Remove "${title}" ?`,
            cancelText: 'Cancel',
            confirmText: 'Remove',
            callback: async () => {
                try {
                    dispatch({
                        type: 'playlist/REMOVE_ITEM',
                        payload: { playlistItemId }
                    });

                    dispatch({
                        type: 'playlists/REMOVE_ITEM',
                        payload: { playlistId }
                    });

                    openNotification(`Removed ${title}.`);

                    await api.removePlaylistItem(playlistItemId);
                } catch (error) {
                    openNotification('Error deleting playlist item.');
                }
            }
        });
    };

    const clearPlaylistItems = () => dispatch({ type: 'playlist/CLEAR_ITEMS' });

    return [
        playlistItems,
        {
            getPlaylistTitle,
            getPlaylistItems,
            addPlaylistItem,
            editPlaylistItem,
            removePlaylistItem,
            clearPlaylistItems
        }
    ];
};
