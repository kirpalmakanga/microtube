import { useStore } from '..';
import { useNotifications } from './notifications';
import * as api from '../../api/youtube';
import { usePlayer } from './player';
import { usePrompt } from './prompt';
import { PlaylistData } from '../../../@types/alltypes';

export const usePlaylists = (channelId?: string) => {
    const [{ playlists }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();
    const [, { setActiveQueueItem, queueItems }] = usePlayer();
    const [, { openPrompt }] = usePrompt();

    console.log('usePlaylists', playlists.nextPageToken, playlists.hasNextPage);

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
            const { nextPageToken: pageToken, hasNextPage } = playlists;

            console.log(
                'getPlaylists',
                playlists.nextPageToken,
                playlists.hasNextPage
            );

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
    };

    const createPlaylist = async ({ title, privacyStatus }: PlaylistData) => {
        try {
            const payload = await api.createPlaylist({ title, privacyStatus });

            dispatch({ type: 'playlists/ADD_ITEM', payload });

            return payload;
        } catch (error) {
            openNotification(`Error creating playlist "${title}".`);
        }
    };

    const removePlaylist = ({ id: playlistId, title }: PlaylistData) => {
        openPrompt({
            headerText: `Remove playlist ${title} ?`,
            confirmText: 'Remove',
            callback: async () => {
                try {
                    dispatch({
                        type: 'playlists/REMOVE_ITEM',
                        payload: { playlistId }
                    });

                    openNotification(`Removed playlist "${title}".`);

                    await api.removePlaylist(playlistId);
                } catch (error) {
                    openNotification('Error deleting playlist.');
                }
            }
        });
    };

    const clearPlaylists = () => dispatch({ type: 'playlists/CLEAR_ITEMS' });

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
