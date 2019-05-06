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

export const closePrompt = () => async (dispatch) => {
    dispatch({ type: 'prompt/CLOSE' });

    await delay(300);

    dispatch({ type: 'prompt/RESET' });
};

export const prompt = ({ callback = async () => {}, ...config } = {}) => (
    dispatch
) =>
    dispatch({
        type: 'prompt/OPEN',
        data: {
            ...config,
            callback: async (data) => {
                await callback(data);

                dispatch(closePrompt());
            }
        }
    });

export function getPlaylists(config) {
    return async (dispatch, getState) => {
        try {
            const {
                playlists: { nextPageToken: pageToken, hasNextPage }
            } = getState();

            if (!hasNextPage) {
                return;
            }

            const data = await api.getPlaylists({ ...config, pageToken });

            dispatch({ type: 'playlists/UPDATE_ITEMS', data });
        } catch (err) {
            dispatch(notify({ message: 'Error fetching playlists.' }));
        }
    };
}

export function removePlaylist({ title, playlistId }) {
    return (dispatch) => {
        dispatch(
            prompt({
                promptText: `Remove ${title} ?`,
                confirmText: 'Remove',
                callback: async () => {
                    try {
                        await api.removePlaylist(playlistId);

                        dispatch({
                            type: 'playlists/REMOVE_ITEM',
                            data: { playlistId }
                        });

                        dispatch(
                            notify({
                                message: `Removed playlist "${title}".`
                            })
                        );
                    } catch (error) {
                        dispatch(
                            notify({ message: 'Error deleting playlist.' })
                        );
                    }
                }
            })
        );
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
    return async (dispatch, getState) => {
        try {
            const {
                playlists: { nextPageToken: pageToken, hasNextPage }
            } = getState();

            if (!hasNextPage) {
                return;
            }

            dispatch({ type: 'playlist/CLEAR_ITEMS' });

            const data = await api.getPlaylistItems({ ...config, pageToken });

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
    return async (dispatch, getState) => {
        await new Promise((callback) => {
            dispatch(
                prompt({
                    promptText: `Remove "${title}" ?`,
                    confirmText: 'Remove',
                    callback
                })
            );
        });

        const {
            playlistItems: { playlistTitle }
        } = getState();

        (async () => {
            try {
                await api.removePlaylistItem(playlistItemId);

                dispatch({
                    type: 'playlist/REMOVE_ITEM',
                    data: { playlistItemId, playlistId }
                });

                dispatch(
                    notify({
                        message: `Removed from playlist: "${playlistTitle}."`
                    })
                );
            } catch (error) {
                dispatch(
                    notify({
                        message: 'Error deleting playlist item.'
                    })
                );
            }
        })();
    };
}

export function addPlaylistItem({ playlistId, videoId }) {
    return async (dispatch) => {
        await api.addPlaylistItem(playlistId, videoId);

        dispatch({
            type: 'playlists/UPDATE_ITEM',
            data: {
                playlistId
            }
        });
    };
}

export function editPlaylistItem({ id: videoId }) {
    return (dispatch) =>
        dispatch(
            prompt({
                mode: 'playlist',
                promptText: `Add to playlist`,
                confirmText: 'Done',
                callback: ({
                    newPlaylistTitle,
                    playlistTitle,
                    privacyStatus,
                    playlistId
                }) => {
                    (async () => {
                        try {
                            if (newPlaylistTitle) {
                                const { id } = await api.createPlaylist({
                                    title: newPlaylistTitle,
                                    privacyStatus
                                });

                                playlistId = id;
                            }

                            if (playlistId) {
                                await dispatch(
                                    addPlaylistItem({ playlistId, videoId })
                                );

                                dispatch(
                                    notify({
                                        message: `Added to playlist "${newPlaylistTitle ||
                                            playlistTitle}."`
                                    })
                                );
                            }
                        } catch (error) {
                            console.error('error', error);
                            dispatch(
                                notify({
                                    message: 'Error editing playlist item.'
                                })
                            );
                        }
                    })();
                }
            })
        );
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

                dispatch({ type: 'player/QUEUE_PUSH', items });

                if (play && !pageToken && items.length) {
                    dispatch({
                        type: 'player/SET_ACTIVE_QUEUE_ITEM',
                        data: { index: newIndex }
                    });
                }

                if (nextPageToken) {
                    getItems(nextPageToken);
                }
            } catch (err) {
                console.error(err);
                dispatch(notify({ message: 'Error queueing playlist items.' }));
            }
        };

        getItems();
    };
}

export function searchVideos(config) {
    return async (dispatch, getState) => {
        try {
            const {
                search: { hasNextPage, forMine, nextPageToken: pageToken }
            } = getState();

            if (!hasNextPage) {
                return;
            }

            const data = await api.searchVideos({
                ...config,
                forMine,
                pageToken
            });

            dispatch({ type: 'search/UPDATE_ITEMS', data });
        } catch (err) {
            console.error(err);
            dispatch(notify({ message: 'Error searching videos.' }));
        }
    };
}

export const queueVideos = (ids = []) => async (dispatch) => {
    try {
        const items = await api.getVideosFromIds(ids);

        dispatch({ type: 'player/QUEUE_PUSH', items });
    } catch (err) {
        dispatch(notify({ message: 'Error queuing videos.' }));
    }
};

/* Channels */
export const getSubscriptions = () => async (dispatch, getState) => {
    try {
        const {
            subscriptions: { nextPageToken: pageToken, hasNextPage }
        } = getState();

        if (!hasNextPage) {
            return;
        }

        const data = await api.getSubscriptions({ mine: true, pageToken });

        dispatch({ type: 'subscriptions/UPDATE_ITEMS', data });
    } catch (err) {
        dispatch(notify({ message: 'Error fetching subscriptions.' }));
    }
};

export const subscribeToChannel = (channelId) => async (dispatch) => {
    try {
        await api.subscribeToChannel(channelId);

        dispatch({ type: 'subscriptions/SUBSCRIBE', data: { channelId } });
    } catch (error) {
        dispatch(notify({ message: 'Error subscribing to channel.' }));
    }
};

export const unsubscribeFromChannel = (subscriptionId) => async (dispatch) => {
    try {
        await api.unsubscribeFromChannel(subscriptionId);

        dispatch({
            type: 'subscriptions/UNSUBSCRIBE',
            data: { subscriptionId }
        });
    } catch (error) {
        dispatch(notify({ message: 'Error subscribing to channel.' }));
    }
};

export const getChannel = (channelId) => async (dispatch) => {
    try {
        const data = await api.getChannel(channelId);

        dispatch({ type: 'channel/UPDATE_DATA', data });
    } catch (err) {
        dispatch(notify({ message: 'Error fetching channel data.' }));
    }
};

export const getChannelVideos = ({ channelId }) => async (
    dispatch,
    getState
) => {
    try {
        const {
            channel: { nextPageToken: pageToken, hasNextPage }
        } = getState();

        if (!hasNextPage) {
            return;
        }

        const data = await api.getChannelVideos({ channelId, pageToken });

        dispatch({ type: 'channel/UPDATE_ITEMS', data });
    } catch (err) {
        dispatch(notify({ message: 'Error fetching channel videos.' }));
    }
};

/* Auth */
export const signIn = () => async (dispatch) => {
    try {
        const data = await api.signIn();

        dispatch({ type: 'auth/SIGN_IN', data });
    } catch (error) {
        dispatch(notify({ message: 'Error signing in user.' }));
    }
};

export const signOut = () => async (dispatch) => {
    try {
        await api.signOut();

        dispatch({ type: 'auth/SIGN_OUT' });
    } catch (error) {
        dispatch(notify({ message: 'Error signing out user.' }));
    }
};
