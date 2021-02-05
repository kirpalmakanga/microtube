import * as api from '../../api/youtube';
import database from '../../api/database';

import { __DEV__ } from '../../config/app';
export const enableImportMethods = () => (dispatch) => {
    if (!window.queueVideos) {
        window.queueVideos = (ids = []) => dispatch(queueVideos(ids));
    }

    if (!window.queuePlaylist) {
        window.queuePlaylist = (id) => dispatch(queuePlaylist(id));
    }
};
/* Videos */

/* Playlist */
export function getPlaylistTitle(playlistId) {
    return async (dispatch) => {
        const playlistTitle = await api.getPlaylistTitle(playlistId);

        dispatch({
            type: 'playlist/SET_TITLE',
            data: { playlistTitle }
        });
    };
}

// export function getPlaylistItems(playlistId) {
//     return (dispatch, getState) =>
//         catchErrors(
//             async () => {
//                 const {
//                     playlistItems: { nextPageToken: pageToken, hasNextPage }
//                 } = getState();

//                 if (!hasNextPage) {
//                     return;
//                 }

//                 const data = await api.getPlaylistItems({
//                     playlistId,
//                     pageToken
//                 });

//                 dispatch({
//                     type: 'playlist/UPDATE_ITEMS',
//                     data
//                 });
//             },
//             () =>
//                 dispatch(notify({ message: 'Error fetching playlist items.' }))
//         );
// }

export const clearPlaylistItems = () => (dispatch) =>
    dispatch({ type: 'playlist/CLEAR_ITEMS' });

// export function removePlaylistItem(playlistItemId, playlistId, title) {
//     return async (dispatch) =>
//         dispatch(
//             prompt(
//                 {
//                     promptText: `Remove "${title}" ?`,
//                     confirmText: 'Remove'
//                 },
//                 () => {
//                     catchErrors(
//                         () => {
//                             dispatch({
//                                 type: 'playlist/REMOVE_ITEM',
//                                 data: { playlistItemId, playlistId }
//                             });

//                             dispatch(
//                                 notify({
//                                     message: `Removed ${title}.`
//                                 })
//                             );

//                             return api.removePlaylistItem(playlistItemId);
//                         },
//                         () =>
//                             dispatch(
//                                 notify({
//                                     message: 'Error deleting playlist item.'
//                                 })
//                             )
//                     );
//                 }
//             )
//         );
// }

/* Player */

// export const setQueue = (queue) => (dispatch) => {
//     dispatch({ type: 'player/UPDATE_DATA', data: { queue } });

//     dispatch(saveQueue());
// };

// export const removeQueueItem = (videoId) => (dispatch) => {
//     dispatch({ type: 'player/REMOVE_QUEUE_ITEM', data: { videoId } });

//     dispatch(saveQueue());
// };

// export const clearQueue = () => (dispatch) =>
//     dispatch(
//         prompt(
//             {
//                 promptText: 'Clear the queue ?',
//                 confirmText: 'Clear'
//             },
//             () => {
//                 dispatch({ type: 'player/CLEAR_QUEUE' });

//                 dispatch(saveQueue());
//             }
//         )
//     );

// export const setActiveQueueItem = (currentId) => (dispatch) => {
//     dispatch({
//         type: 'player/UPDATE_DATA',
//         data: { currentId }
//     });

//     dispatch(saveQueue());
// };

// export const playItem = (data) => (dispatch) => {
//     dispatch(queueItem(data));

//     dispatch(setActiveQueueItem(data.id));
// };

// export function queuePlaylist(playlistId, play) {
//     return (dispatch, getState) => {
//         const {
//             player: { queue }
//         } = getState();

//         const getItems = async (pageToken) => {
//             const { items, nextPageToken } = await api.getPlaylistItems({
//                 playlistId,
//                 pageToken
//             });

//             const newItems = dispatch(queueItems(items));

//             if (play && !pageToken && newItems.length) {
//                 const [{ id }] = newItems;

//                 dispatch(setActiveQueueItem(id));
//             }

//             if (nextPageToken) {
//                 await getItems(nextPageToken);
//             }
//         };

//         catchErrors(getItems, () =>
//             dispatch(notify({ message: 'Error queueing playlist items.' }))
//         );
//     };
// }

// export const queueVideos = (ids = []) => (dispatch) =>
//     catchErrors(
//         async () => {
//             const items = await api.getVideosFromIds(ids);

//             dispatch(queueItems(items));
//         },
//         () => dispatch(notify({ message: 'Error queuing videos.' }))
//     );

// export const importVideos = () => (dispatch) =>
//     dispatch(
//         prompt(
//             {
//                 promptText: 'Import videos',
//                 confirmText: 'Import',
//                 form: true
//             },
//             async (text) => {
//                 const lines = splitLines(text).filter(Boolean);

//                 if (!lines.length) {
//                     return;
//                 }

//                 const videoIds = [...new Set(lines.map(parseVideoId))];

//                 const chunks = chunk(videoIds, 50);

//                 for (const ids of chunks) {
//                     await dispatch(queueVideos(ids));
//                 }
//             }
//         )
//     );

/* Search */
// export function searchVideos(config) {
//     return (dispatch, getState) =>
//         catchErrors(
//             async () => {
//                 const {
//                     search: { hasNextPage, forMine, nextPageToken: pageToken }
//                 } = getState();

//                 if (!hasNextPage) {
//                     return;
//                 }

//                 const data = await api.searchVideos({
//                     ...config,
//                     forMine,
//                     pageToken
//                 });

//                 dispatch({ type: 'search/UPDATE_ITEMS', data });
//             },
//             () => dispatch(notify({ message: 'Error searching videos.' }))
//         );
// }

export const setSearchTarget = (forMine) => ({
    type: 'search/SET_TARGET',
    payload: {
        forMine
    }
});

export const clearSearch = () => ({ type: 'search/RESET' });

/* Channels */
// export const getSubscriptions = (channelId) => (dispatch, getState) =>
//     catchErrors(
//         async () => {
//             const {
//                 subscriptions: { nextPageToken: pageToken, hasNextPage }
//             } = getState();

//             if (!hasNextPage) {
//                 return;
//             }

//             const data = await api.getSubscriptions({
//                 pageToken,
//                 channelId,
//                 ...(!channelId ? { mine: true } : {})
//             });

//             dispatch({ type: 'subscriptions/UPDATE_ITEMS', data });
//         },
//         () => dispatch(notify({ message: 'Error fetching subscriptions.' }))
//     );

// export const subscribeToChannel = (channelId) => async (dispatch) =>
//     catchErrors(
//         async () => {
//             await api.subscribeToChannel(channelId);

//             dispatch({ type: 'subscriptions/SUBSCRIBE', data: { channelId } });
//         },
//         () => dispatch(notify({ message: 'Error subscribing to channel.' }))
//     );

// export const unsubscribeFromChannel = (subscriptionId, channelTitle) => async (
//     dispatch
// ) =>
//     dispatch(
//         prompt(
//             {
//                 promptText: `Unsubscribe from ${channelTitle}`,
//                 confirmText: 'Done'
//             },
//             () => {
//                 catchErrors(
//                     () => {
//                         dispatch({
//                             type: 'subscriptions/UNSUBSCRIBE',
//                             data: { subscriptionId }
//                         });

//                         return api.unsubscribeFromChannel(subscriptionId);
//                     },
//                     () =>
//                         dispatch(
//                             notify({
//                                 message: 'Error unsubscribing to channel.'
//                             })
//                         )
//                 );
//             }
//         )
//     );

// export const getChannel = (channelId) => async (dispatch) =>
//     catchErrors(
//         async () => {
//             const data = await api.getChannel(channelId);

//             dispatch({ type: 'channel/UPDATE_DATA', data });
//         },
//         () => dispatch(notify({ message: 'Error fetching channel data.' }))
//     );

// export const clearChannelData = () => (dispatch) =>
//     dispatch({ type: 'channel/CLEAR_DATA' });

// export const getChannelVideos = ({ channelId }) => async (dispatch, getState) =>
//     catchErrors(
//         async () => {
//             const {
//                 channel: { nextPageToken: pageToken, hasNextPage }
//             } = getState();

//             if (!hasNextPage) {
//                 return;
//             }

//             const data = await api.getChannelVideos({ channelId, pageToken });

//             dispatch({ type: 'channel/UPDATE_ITEMS', data });
//         },
//         () => dispatch(notify({ message: 'Error fetching channel videos.' }))
//     );

// export const clearChannelVideos = () => (dispatch) =>
//     dispatch({ type: 'channel/CLEAR_ITEMS' });
