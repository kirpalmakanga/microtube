import { useStore } from '..';
import { useNotifications } from '../notifications';
import { usePrompt } from '../prompt';

import * as api from '../../api/youtube';
import { initialState } from './_state';

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
                    playlistId,
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

    const addPlaylistItem = async (data: VideoData, playlistId: string) => {
        const { id } = data;
        const playlistItemId = await api.addPlaylistItem(playlistId, id);

        if (playlistId === playlistItems.playlistId) {
            setState('playlistItems', 'items', (items) => [
                ...items,
                {
                    ...data,
                    playlistId,
                    playlistItemId
                }
            ]);
        }
    };

    const editPlaylistItem = (videoData: VideoData) => {
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
                    const { thumbnails } = videoData;

                    if (playlistId) {
                        await addPlaylistItem(videoData, playlistId);

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
                    } else {
                        const playlist = await api.createPlaylist({
                            title,
                            privacyStatus
                        });

                        await addPlaylistItem(videoData, playlist.id);

                        setState('playlists', 'items', (items) => [
                            {
                                ...playlist,
                                thumbnails,
                                itemCount: 1
                            },
                            ...items
                        ]);
                    }

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
                    setState('playlistItems', 'items', (items) =>
                        items.filter(
                            ({ playlistItemId: itemPlaylistId }) =>
                                itemPlaylistId !== playlistItemId
                        )
                    );

                    setState('playlists', 'items', (items) => {
                        const index = items.findIndex(
                            ({ id }) => id === playlistId
                        );

                        if (index > -1) items[index].itemCount--;

                        return items;
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
