import { useStore } from '..';
import { usePlaylists } from './playlists';
import { useNotifications } from './notifications';
import { usePrompt } from './prompt';

import { PlaylistData, PlaylistItemData } from '../../../@types/alltypes';

import * as api from '../../api/youtube';
import { initialState, PlaylistItemsState } from '../reducers/_playlist-items';

export const usePlaylistItems = (playlistId?: string) => {
    const [{ playlistItems }, setState] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { openPrompt }] = usePrompt();
    const [, { createPlaylist }] = usePlaylists();

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

            const { nextPageToken: pageToken, hasNextPage } = playlistItems;

            if (hasNextPage) {
                const {
                    items: newItems,
                    nextPageToken = '',
                    totalResults
                } = await api.getPlaylistItems({
                    playlistId,
                    pageToken
                });

                setState(
                    'playlistItems',
                    ({ items, ...state }: PlaylistItemsState) => ({
                        ...state,
                        items: [...items, ...newItems],
                        nextPageToken,
                        hasNextPage: !!nextPageToken,
                        totalResults
                    })
                );
            }
        } catch (error) {
            openNotification('Error fetching playlist items.');
        }
    };

    const addPlaylistItem = async (id: string, playlistId: string) => {
        try {
            await api.addPlaylistItem(playlistId, id);

            const {
                items: [playlist]
            } = await api.getPlaylists({ ids: [playlistId] });

            if (playlist) {
                setState(
                    'playlists/items',
                    ({ id }: PlaylistData) => id === playlistId,
                    playlist
                );
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
                    setState('playlist/items', (items: PlaylistItemData[]) =>
                        items.filter(
                            ({ playlistItemId: itemPlaylistId }) =>
                                itemPlaylistId !== playlistItemId
                        )
                    );

                    setState(
                        'playlists/items',
                        ({ id }: PlaylistData) => id === playlistId,
                        'itemCount',
                        (itemCount: number) => itemCount - 1
                    );

                    openNotification(`Removed ${title}.`);

                    await api.removePlaylistItem(playlistItemId);
                } catch (error) {
                    openNotification('Error deleting playlist item.');
                }
            }
        });
    };

    const clearPlaylistItems = () => setState({ playlistItems: initialState });

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
