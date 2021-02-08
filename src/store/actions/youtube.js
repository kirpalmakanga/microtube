// import * as api from '../../api/youtube';
// import database from '../../api/database';

// import { __DEV__ } from '../../config/app';
// export const enableImportMethods = () => (dispatch) => {
//     if (!window.queueVideos) {
//         window.queueVideos = (ids = []) => dispatch(queueVideos(ids));
//     }

//     if (!window.queuePlaylist) {
//         window.queuePlaylist = (id) => dispatch(queuePlaylist(id));
//     }
// };

/* Player */

// export const playItem = (data) => (dispatch) => {
//     dispatch(queueItem(data));

//     dispatch(setActiveQueueItem(data.id));
// };

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

// export const setSearchTarget = (forMine) => ({
//     type: 'search/SET_TARGET',
//     payload: {
//         forMine
//     }
// });

// export const clearSearch = () => ({ type: 'search/RESET' });

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
