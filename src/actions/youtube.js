import * as api from '../api/youtube';
import { parseFeed } from '../lib/helpers';
import { PROXY_URL } from '../config/app';
import { FEED_URL } from '../config/api';

export function getPlaylists(config) {
    return async (dispatch) => {
        try {
            const data = await api.getPlaylists(config);
            dispatch({ type: 'playlists/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch({ type: 'NOTIFY', data: 'Error fetching playlists.' });
        }
    };
}

// export function getPlaylistTitle (accessToken, playlistId) {
//   return async (dispatch) => {
//     try {
//       const title = await api.getPlaylistTitle(accessToken, [playlistId])
//
//       dispatch({ type: 'SET_PLAYLIST_TITLE', data: { title } })
//     } catch (err) {
//       dispatch({ type: 'NOTIFY', data: 'Error fetching playlist title.' })
//     }
//   }
// }

export function getPlaylistItems(config) {
    return async (dispatch) => {
        try {
            const { playlistId } = config;
            const data = await api.getPlaylistItems(config);

            dispatch({
                type: 'playlist/UPDATE_ITEMS',
                data: { ...data, playlistId }
            });
        } catch (err) {
            dispatch({
                type: 'NOTIFY',
                data: 'Error fetching playlist items.'
            });
        }
    };
}

export function removePlaylistItem({ title, playlistItemId }) {
    return (dispatch) => {
        dispatch({
            type: 'PROMPT',
            data: {
                promptText: `Remove ${title} ?`,
                confirmText: 'Remove',
                callback: async () => {
                    try {
                        await api.removePlaylistItem(playlistItemId);

                        dispatch({
                            type: 'playlist/REMOVE_ITEM',
                            data: { playlistItemId }
                        });

                        dispatch({ type: 'PROMPT_CLOSE' });
                    } catch (error) {
                        dispatch({
                            type: 'NOTIFY',
                            data: 'Error deleting playlist item.'
                        });
                    }
                }
            }
        });
    };
}

export function queuePlaylist({ playlistId, play }) {
    return (dispatch, getState) => {
        const {
            player: { queue }
        } = getState();

        const newIndex = queue.length;

        const getItems = async (pageToken) => {
            try {
                const { items, nextPageToken } = await api.getPlaylistItems({
                    playlistId,
                    pageToken
                });

                dispatch({ type: 'QUEUE_PUSH', data: items });

                if (play && !pageToken && items.length) {
                    dispatch({
                        type: 'QUEUE_SET_ACTIVE_ITEM',
                        data: { index: newIndex }
                    });
                }

                if (nextPageToken) {
                    getItems(nextPageToken);
                }
            } catch (err) {
                dispatch({
                    type: 'NOTIFY',
                    data: 'Error fetching playlist items.'
                });
            }
        };

        getItems();
    };
}

export function searchVideos(config) {
    return async (dispatch) => {
        try {
            dispatch({
                type: 'search/SET_QUERY',
                data: { query: config.query }
            });

            const data = await api.searchVideos(config);

            dispatch({ type: 'search/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch({ type: 'NOTIFY', data: 'Error searching videos.' });
        }
    };
}

export function importVideos(ids = []) {
    return async (dispatch) => {
        try {
            const data = await api.getVideosFromIds(ids);

            dispatch({ type: 'QUEUE_PUSH', data });
        } catch (err) {
            dispatch({ type: 'NOTIFY', data: 'Error fetching video.' });
        }
    };
}

export function getSubscriptions(config) {
    return async (dispatch) => {
        try {
            const data = await api.getSubscriptions(config);

            dispatch({ type: 'subscriptions/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch({ type: 'NOTIFY', data: 'Error fetching subscriptions.' });
        }
    };
}

export function getFeed() {
    return async (dispatch) => {
        try {
            const channelIds = [];

            const getItems = async (pageToken = '') => {
                const {
                    items: newItems,
                    nextPageToken
                } = await api.getSubscriptions({
                    mine: true,
                    pageToken
                });

                channelIds.push(...newItems);

                if (nextPageToken) {
                    getItems(nextPageToken);
                }
            };

            await getItems();

            const feeds = await Promise.all(
                channelIds.map(({ channelId }) =>
                    parseFeed(
                        `${PROXY_URL}/${FEED_URL}?channel_id=${channelId}`
                    )
                )
            );

            const parseVideo = ({
                id,
                author: channelTitle,
                pubDate: publishedAt,
                title
            }) => ({
                videoId: id.split(':')[2],
                publishedAt,
                title,
                channelTitle
            });

            const sortDesc = (key, convert) => (a, b) =>
                convert(b[key]) - convert(a[key]);

            const data = feeds
                .reduce(
                    (arr, { items }) => arr.concat(items.map(parseVideo)),
                    []
                )
                .sort(
                    sortDesc('publishedAt', (date) => new Date(date).getTime())
                );

            dispatch({ type: 'GET_FEED_VIDEOS', data });
        } catch (error) {
            console.error(error);
            dispatch({ type: 'NOTIFY', data: 'Error fetching feed.' });
        }
    };
}

// export function unsubscribe (id) {
//   return (dispatch) => {
//     dispatch({ type: 'UNSUBSCRIBE'})
//
//     api.unsubscribe(id)
//     .then(data => {
//       console.log('unsubscribed', data)
//       // dispatch({
//       //   type: 'UNSUBSCRIBE_SUCCESS',
//       //   data
//       // })
//     })
//     .catch(err => dispatch({ type: 'NOTIFY', data: err }))
//   }
// }

export function getChannelTitle(channelId) {
    return async (dispatch) => {
        try {
            const title = await api.getChannelTitle(channelId);

            dispatch({ type: 'SET_CHANNEL_TITLE', data: { title } });
        } catch (err) {
            dispatch({ type: 'NOTIFY', data: 'Error fetching channel title.' });
        }
    };
}

export function getChannelVideos(config) {
    return async (dispatch) => {
        try {
            const data = await api.getChannelVideos(config);

            dispatch({ type: 'GET_CHANNEL_VIDEOS', data });
        } catch (err) {
            dispatch({
                type: 'NOTIFY',
                data: 'Error fetching channel videos.'
            });
        }
    };
}
