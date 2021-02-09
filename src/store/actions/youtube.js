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

/* Channels */

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
