import { useEffect } from 'react';

import { useStore } from '..';
import { useNotifications } from './notifications';
import { usePrompt } from './prompt';

import { ThumbnailsData } from '../../../@types/alltypes';

import * as api from '../../api/youtube';

interface VideoData {
    id: string;
    title: string;
    description: string;
    thumbnails: ThumbnailsData;
    duration: number;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    playlistId: string;
    playlistItemId: string;
}

interface PlaylistData {
    id: string;
    title: string;
    privacyStatus: string;
}

export const usePlaylistItems = (playlistId: string) => {
    const [{ playlistItems }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getPlaylistItems = async () => {
        try {
            const { nextPageToken: pageToken, hasNextPage } = playlistItems;

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
    };

    const addPlaylistItem = async (id: string, playlistId: string) => {
        try {
            await api.addPlaylistItem(playlistId, id);

            const {
                items: [payload]
            } = await api.getPlaylists({ ids: [playlistId] });

            if (payload) {
                dispatch({
                    type: 'playlists/UPDATE_ITEM',
                    payload
                });
            }
        } catch (error) {
            openNotification('Error adding playlist item.');
        }
    };

    const editPlaylistItem = ({ id: videoId }: VideoData) => {
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
                        const { id: newPlaylistId } = await api.createPlaylist({
                            title,
                            privacyStatus
                        });

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
    }: VideoData) => {
        openPrompt({
            headerText: `Remove "${title}" ?`,
            cancelText: 'Cancel',
            confirmText: 'Remove',
            callback: async () => {
                try {
                    dispatch({
                        type: 'playlist/REMOVE_ITEM',
                        data: { playlistItemId, playlistId }
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

    useEffect(() => clearPlaylistItems, []);

    return [
        playlistItems,
        {
            getPlaylistItems,
            addPlaylistItem,
            editPlaylistItem,
            removePlaylistItem,
            clearPlaylistItems
        }
    ];
};
