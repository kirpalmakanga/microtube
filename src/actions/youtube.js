import * as api from '../api/youtube';

import { delay } from '../lib/helpers';

const notify = ({ message }) => async (dispatch, getState) => {
    dispatch({ type: 'notifications/OPEN', data: message });

    await delay(4000);

    if (getState().notifications.message) {
        dispatch({ type: 'notifications/CLOSE' });

        await delay(300);

        dispatch({ type: 'notifications/CLEAR_MESSAGE' });
    }
};

export function getPlaylists(config) {
    return async (dispatch) => {
        try {
            const data = await api.getPlaylists(config);

            dispatch({ type: 'playlists/UPDATE_ITEMS', data });
        } catch (err) {
            console.error(err);
            dispatch(notify({ message: 'Error fetching playlists.' }));
        }
    };
}

export function removePlaylist({ title, playlistId }) {
    return (dispatch) => {
        dispatch({
            type: 'prompt/OPEN',
            data: {
                promptText: `Remove ${title} ?`,
                confirmText: 'Remove',
                callback: async () => {
                    try {
                        await api.removePlaylist(playlistId);

                        dispatch({
                            type: 'playlists/REMOVE_ITEM',
                            data: { playlistId }
                        });

                        dispatch({ type: 'prompt/CLOSE' });
                    } catch (error) {
                        dispatch(
                            notify({ message: 'Error deleting playlist.' })
                        );
                    }
                }
            }
        });
    };
}

export function getPlaylistTitle(playlistId) {
    return async (dispatch) => {
        const playlistTitle = await api.getPlaylistTitle(playlistId);

        dispatch({
            type: 'playlist/SET_TITLE',
            data: { playlistTitle }
        });
    };
}

export function getPlaylistItems(config) {
    return async (dispatch) => {
        try {
            const data = await api.getPlaylistItems(config);

            dispatch({
                type: 'playlist/UPDATE_ITEMS',
                data
            });
        } catch (err) {
            console.error(err);
            dispatch(notify({ message: 'Error fetching playlist items.' }));
        }
    };
}

export function removePlaylistItem({ title, playlistId, playlistItemId }) {
    return (dispatch, getState) => {
        dispatch({
            type: 'prompt/OPEN',
            data: {
                promptText: `Remove ${title} ?`,
                confirmText: 'Remove',
                callback: async () => {
                    try {
                        const {
                            playlistItems: { playlistTitle }
                        } = getState();

                        await api.removePlaylistItem(playlistItemId);

                        dispatch({
                            type: 'playlist/REMOVE_ITEM',
                            data: { playlistItemId, playlistId }
                        });

                        dispatch(
                            notify({
                                message: `Removed "${title}" from playlist: "${playlistTitle}."`
                            })
                        );

                        dispatch({ type: 'prompt/CLOSE' });
                    } catch (error) {
                        dispatch(
                            notify({ message: 'Error deleting playlist item.' })
                        );
                    }
                }
            }
        });
    };
}

const loadData = (promise) => async (dispatch) => {
    dispatch({
        type: 'app/SET_LOADER',
        data: true
    });

    const data = await promise;

    dispatch({
        type: 'app/SET_LOADER',
        data: false
    });

    return data;
};

export function editPlaylistItem(data) {
    return async (dispatch) => {
        try {
            const playlists = await dispatch(
                loadData(
                    api.getAllPlaylists({
                        mine: true
                    })
                )
            );

            dispatch({
                type: 'prompt/OPEN',
                data: {
                    promptText: `Add to playlist`,
                    confirmText: 'Done',
                    playlists: playlists.items,
                    callback: async (playlistId) => {
                        try {
                            if (playlistId) {
                                // if (action === 'insert') {
                                const { id } = data;

                                const {
                                    id: playlistItemId
                                } = await api.addPlaylistItem(playlistId, id);

                                // dispatch({
                                //     type: 'playlist/UPDATE_ITEMS',
                                //     data: {
                                //         items: [{ ...data, playlistItemId }]
                                //     }
                                // });

                                dispatch({
                                    type: 'playlists/UPDATE_ITEM',
                                    data: {
                                        playlistId
                                    }
                                });
                                // } else if (action === 'remove') {
                                // const { playlistItemId } = data;
                                // await api.removePlaylistItem(playlistItemId);
                                // dispatch({
                                //     type: 'playlist/REMOVE_ITEM',
                                //     data: { playlistItemId }
                                // });
                                // }
                            }

                            dispatch({ type: 'prompt/CLOSE' });
                        } catch (error) {
                            console.log(error);
                            dispatch(
                                notify({
                                    message: 'Error editing playlist item.'
                                })
                            );
                        }
                    }
                }
            });
        } catch (error) {
            console.log(error);
            dispatch(notify({ message: 'Error editing playlist item.' }));
        }
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
                dispatch(notify({ message: 'Error fetching playlist items.' }));
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
            dispatch(notify({ message: 'Error searching videos.' }));
        }
    };
}

export function queueVideos(ids = []) {
    return async (dispatch) => {
        try {
            const data = await api.getVideosFromIds(ids);

            dispatch({ type: 'QUEUE_PUSH', data });
        } catch (err) {
            dispatch(notify({ message: 'Error fetching video.' }));
        }
    };
}

export function getSubscriptions(config) {
    return async (dispatch) => {
        try {
            const data = await api.getSubscriptions(config);

            dispatch({ type: 'subscriptions/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch(notify({ message: 'Error fetching subscriptions.' }));
        }
    };
}

export function getChannelTitle(channelId) {
    return async (dispatch) => {
        try {
            const title = await api.getChannelTitle(channelId);

            dispatch({ type: 'channel/SET_TITLE', data: { title } });
        } catch (err) {
            dispatch(notify({ message: 'Error fetching channel title.' }));
        }
    };
}

export function getChannelVideos(config) {
    return async (dispatch) => {
        try {
            const data = await api.getChannelVideos(config);

            dispatch({ type: 'channel/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch(notify({ message: 'Error fetching channel videos.' }));
        }
    };
}
