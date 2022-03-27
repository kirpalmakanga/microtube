import { useStore } from '..';
import { useNotifications } from '../notifications';
import { usePrompt } from '../prompt';

import {
    PlaylistData,
    PlaylistItemData,
    VideoData
} from '../../../@types/alltypes';

import * as api from '../../api/youtube';
import { initialState, PlaylistItemsState } from './_state';
import { PlaylistsState } from '../playlists/_state';

export const usePlaylistItems = (playlistId?: string) => {
    const [{ playlists, playlistItems }, setState] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();

    const getPlaylistTitle = async (playlistId: string) => {
        const playlistTitle = await api.getPlaylistTitle(playlistId);

        setState('playlistItems', {
            playlistTitle
        });
    };

    const getPlaylistItems = async () => {
        try {
            if (!playlistId) {
                throw new Error('playlistId is required');
            }

            const {
                items,
                nextPageToken: pageToken,
                hasNextPage
            } = playlistItems;

            if (hasNextPage) {
                const {
                    items: newItems,
                    nextPageToken = '',
                    totalResults
                } = await api.getPlaylistItems({
                    playlistId,
                    pageToken
                });

                setState('playlistItems', {
                    items: [...items, ...newItems],
                    nextPageToken,
                    hasNextPage: !!nextPageToken,
                    totalResults
                });
            }
        } catch (error) {
            openNotification('Error fetching playlist items.');
        }
    };

    const editPlaylistItem = ({ id: videoId, thumbnails }: VideoData) => {
        openPrompt({
            mode: 'playlists',
            headerText: 'Save to playlist',
            cancelText: 'Close',
            callback: async ({
                id: playlistId,
                title,
                privacyStatus
            }: PlaylistData) => {
                try {
                    if (playlistId) {
                        await api.addPlaylistItem(playlistId, videoId);

                        const index = playlists.items.findIndex(
                            ({ id }: PlaylistData) => id === playlistId
                        );

                        if (index > -1) {
                            setState(
                                'playlists',
                                'items',
                                index,
                                'itemCount',
                                (c: number) => c + 1
                            );
                        }

                        /* TODO: update current playlist */
                    } else {
                        const playlist = await api.createPlaylist({
                            title,
                            privacyStatus
                        });

                        await api.addPlaylistItem(playlist.id, videoId);

                        setState(
                            'playlists',
                            'items',
                            (items: PlaylistData[]) => [
                                {
                                    ...playlist,
                                    thumbnails,
                                    itemCount: 1
                                },
                                ...items
                            ]
                        );
                    }

                    openNotification(`Added to playlist "${title}".`);
                } catch (error) {
                    console.error(error);
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
                    setState(
                        'playlistItems',
                        ({ items }: PlaylistItemsState) => ({
                            items: items.filter(
                                ({ playlistItemId: itemPlaylistId }) =>
                                    itemPlaylistId !== playlistItemId
                            )
                        })
                    );

                    setState('playlists', ({ items }: PlaylistsState) => {
                        const index = items.findIndex(
                            ({ id }) => id === playlistId
                        );

                        if (index > -1) items[index].itemCount--;

                        return { items };
                    });

                    openNotification(`Removed ${title}.`);

                    await api.removePlaylistItem(playlistItemId);
                } catch (error) {
                    openNotification('Error deleting playlist item.');
                }
            }
        });
    };

    const clearPlaylistItems = () => setState('playlistItems', initialState());

    return [
        playlistItems,
        {
            getPlaylistTitle,
            getPlaylistItems,
            editPlaylistItem,
            removePlaylistItem,
            clearPlaylistItems
        }
    ] as const;
};
