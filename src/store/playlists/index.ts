import { useStore } from '..';
import * as api from '../../api/youtube';
import { usePlayer } from '../player';
import { usePrompt } from '../prompt';
import { useNotifications } from '../notifications';
import { PlaylistData } from '../../../@types/alltypes';

export const usePlaylists = (channelId?: string) => {
    const [{ playlists }, setState] = useStore();
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

    const getPlaylists = async () => {
        try {
            const { items, nextPageToken: pageToken, hasNextPage } = playlists;

            if (hasNextPage) {
                const {
                    items: newItems,
                    nextPageToken = '',
                    totalResults
                } = await api.getPlaylists({
                    ...(channelId ? { channelId } : { mine: true }),
                    pageToken
                });

                setState('playlists', {
                    items: [...items, ...newItems],
                    nextPageToken,
                    hasNextPage: !!nextPageToken,
                    totalResults
                });
            }
        } catch (error) {
            openNotification('Error fetching playlists.');
        }
    };

    const createPlaylist = async (title: string, privacyStatus: string) => {
        try {
            const { items } = playlists;

            const playlist = await api.createPlaylist({ title, privacyStatus });

            setState('playlist', {
                items: [playlist, ...items]
            });

            return playlist;
        } catch (error) {
            openNotification(`Error creating playlist "${title}".`);
        }
    };

    const updatePlaylist = async (data: PlaylistData) => {
        try {
            const { items } = playlists;
            const index = items.findIndex(
                ({ id }: PlaylistData) => id === data.id
            );

            if (index > -1) items[index] = data;
            else items.unshift(data);

            setState('playlists', { items });
        } catch (error) {
            openNotification(`Error updated playlist "${data.title}".`);
        }
    };

    const removePlaylist = ({ id, title }: PlaylistData) => {
        openPrompt({
            headerText: `Remove playlist ${title} ?`,
            confirmText: 'Remove',
            cancelText: 'Cancel',
            callback: async () => {
                try {
                    const { items } = playlists;

                    setState('playlists', {
                        items: items.filter(
                            ({ id: itemId }: PlaylistData) => itemId !== id
                        )
                    });

                    openNotification(`Removed playlist "${title}".`);

                    await api.removePlaylist(id);
                } catch (error) {
                    openNotification('Error deleting playlist.');
                }
            }
        });
    };

    return [
        playlists,
        {
            getPlaylists,
            createPlaylist,
            updatePlaylist,
            removePlaylist,
            queuePlaylist,
            launchPlaylist
        }
    ] as const;
};
