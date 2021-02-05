import { useCallback } from 'react';
import { useStore } from '..';
import { useNotifications } from './notifications';

import * as api from '../../api/youtube';

interface PlaylistItem {
    playlistId: string;
    videoId: string;
}

export const usePlaylistItems = (playlistId: string) => {
    const [{ playlistItems }, dispatch] = useStore();
    const [{ openNotification }] = useNotifications();

    // const editPlaylistItem = useCallback((id) => () => )

    const addPlaylistItem = useCallback(async ({ playlistId, videoId }) => {
        try {
            await api.addPlaylistItem(playlistId, videoId);

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
    }, []);

    return [
        playlistItems,
        {
            addPlaylistItem
            // editPlaylistItem: (videoId) {
            //     return (dispatch) =>
            //         dispatch(
            //             prompt(
            //                 {
            //                     mode: 'playlist',
            //                     promptText: `Save to playlist`,
            //                     confirmText: 'Done'
            //                 },
            //                 ({ title, privacyStatus, playlistId }) => {
            //                     catchErrors(
            //                         async () => {
            //                             if (!playlistId) {
            //                                 const { id } = await dispatch(
            //                                     createPlaylist({
            //                                         title,
            //                                         privacyStatus
            //                                     })
            //                                 );

            //                                 playlistId = id;
            //                             }

            //                             await dispatch(
            //                                 addPlaylistItem({ playlistId, videoId })
            //                             );

            //                             dispatch(
            //                                 notify({
            //                                     message: `Added to playlist "${title}".`
            //                                 })
            //                             );
            //                         },
            //                         () =>
            //                             dispatch(
            //                                 notify({
            //                                     message: 'Error editing playlist item.'
            //                                 })
            //                             )
            //                     );
            //                 }
            //             )
            //         );
            // }
        }
    ];
};
