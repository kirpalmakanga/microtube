import * as api from '../api/youtube';

import { delay, catchErrors } from '../lib/helpers';

import { prompt } from './prompt';

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
    return async (dispatch, getState) =>
        catchErrors(
            async () => {
                const {
                    playlists: { nextPageToken: pageToken, hasNextPage }
                } = getState();

                if (!hasNextPage) {
                    return;
                }

                const data = await api.getPlaylists({ ...config, pageToken });

                dispatch({ type: 'playlists/UPDATE_ITEMS', data });
            },
            () => dispatch(notify({ message: 'Error fetching playlists.' }))
        );
}

export const clearPlaylists = () => (dispatch) =>
    dispatch({ type: 'playlists/CLEAR_ITEMS' });

export function removePlaylist({ title, playlistId }) {
    return (dispatch) => {
        dispatch(
            prompt({
                promptText: `Remove ${title} ?`,
                confirmText: 'Remove',
                callback: () =>
                    catchErrors(
                        async () => {
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
                        },
                        () => {
                            dispatch(
                                notify({ message: 'Error deleting playlist.' })
                            );
                        }
                    )
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
    return (dispatch, getState) =>
        catchErrors(
            async () => {
                const {
                    playlistItems: { nextPageToken: pageToken, hasNextPage }
                } = getState();

                if (!hasNextPage) {
                    return;
                }

                const data = await api.getPlaylistItems({
                    ...config,
                    pageToken
                });

                dispatch({
                    type: 'playlist/UPDATE_ITEMS',
                    data
                });
            },
            () =>
                dispatch(notify({ message: 'Error fetching playlist items.' }))
        );
}

export const clearPlaylistItems = () => (dispatch) =>
    dispatch({ type: 'playlist/CLEAR_ITEMS' });

export function removePlaylistItem({ title, playlistId, playlistItemId }) {
    return async (dispatch) => {
        dispatch(
            prompt({
                promptText: `Remove "${title}" ?`,
                confirmText: 'Remove',
                callback: () => {
                    dispatch({
                        type: 'playlist/REMOVE_ITEM',
                        data: { playlistItemId, playlistId }
                    });

                    dispatch(
                        notify({
                            message: `Removed ${title}.`
                        })
                    );

                    catchErrors(
                        () => api.removePlaylistItem(playlistItemId),
                        () =>
                            dispatch(
                                notify({
                                    message: 'Error deleting playlist item.'
                                })
                            )
                    );
                }
            })
        );
    };
}

export function addPlaylistItem({ playlistId, videoId }) {
    return (dispatch) =>
        catchErrors(
            async () => {
                await api.addPlaylistItem(playlistId, videoId);

                dispatch({
                    type: 'playlists/UPDATE_ITEM',
                    data: {
                        playlistId
                    }
                });
            },
            () => () =>
                dispatch(
                    notify({
                        message: 'Error deleting playlist item.'
                    })
                )
        );
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
                    catchErrors(
                        async () => {
                            if (newPlaylistTitle) {
                                const { id } = await api.createPlaylist({
                                    title: newPlaylistTitle,
                                    privacyStatus
                                });

                                playlistId = id;
                            }

                            if (!playlistId) {
                                return;
                            }

                            await dispatch(
                                addPlaylistItem({ playlistId, videoId })
                            );

                            dispatch(
                                notify({
                                    message: `Added to playlist "${newPlaylistTitle ||
                                        playlistTitle}."`
                                })
                            );
                        },
                        () =>
                            dispatch(
                                notify({
                                    message: 'Error editing playlist item.'
                                })
                            )
                    );
                }
            })
        );
}

export const queueItem = (data) => (dispatch) =>
    dispatch({ type: 'player/QUEUE_PUSH', items: [data] });

export const playItem = (data) => (dispatch) => {
    dispatch({ type: 'player/QUEUE_PUSH', items: [data] });
    dispatch({
        type: 'player/SET_ACTIVE_QUEUE_ITEM'
    });
};

export function queuePlaylist({ playlistId, play }) {
    return (dispatch, getState) => {
        const {
            player: { queue }
        } = getState();

        const newIndex = queue.length;

        const getItems = async (pageToken) => {
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
                await getItems(nextPageToken);
            }
        };

        catchErrors(getItems, () =>
            dispatch(notify({ message: 'Error queueing playlist items.' }))
        );
    };
}

export function searchVideos(config) {
    return (dispatch, getState) =>
        catchErrors(
            async () => {
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
            },
            () => dispatch(notify({ message: 'Error searching videos.' }))
        );
}

export const clearSearch = () => (dispatch) =>
    dispatch({ type: 'search/RESET' });

export const queueVideos = (ids = []) => (dispatch) =>
    catchErrors(
        async () => {
            const items = await api.getVideosFromIds(ids);

            dispatch({ type: 'player/QUEUE_PUSH', items });
        },
        () => dispatch(notify({ message: 'Error queuing videos.' }))
    );

/* Channels */
export const getSubscriptions = (channelId) => (dispatch, getState) =>
    catchErrors(
        async () => {
            const {
                subscriptions: { nextPageToken: pageToken, hasNextPage }
            } = getState();

            if (!hasNextPage) {
                return;
            }

            const data = await api.getSubscriptions({
                pageToken,
                channelId,
                ...(!channelId ? { mine: true } : {})
            });

            dispatch({ type: 'subscriptions/UPDATE_ITEMS', data });
        },
        () => dispatch(notify({ message: 'Error fetching subscriptions.' }))
    );

export const subscribeToChannel = (channelId) => async (dispatch) =>
    catchErrors(
        async () => {
            await api.subscribeToChannel(channelId);

            dispatch({ type: 'subscriptions/SUBSCRIBE', data: { channelId } });
        },
        () => dispatch(notify({ message: 'Error subscribing to channel.' }))
    );

export const unsubscribeFromChannel = (subscriptionId, channelTitle) => async (
    dispatch
) =>
    dispatch(
        prompt({
            promptText: `Unsubscribe from ${channelTitle}`,
            confirmText: 'Done',
            callback: () => {
                dispatch({
                    type: 'subscriptions/UNSUBSCRIBE',
                    data: { subscriptionId }
                });

                catchErrors(
                    () => api.unsubscribeFromChannel(subscriptionId),
                    () =>
                        dispatch(
                            notify({
                                message: 'Error unsubscribing to channel.'
                            })
                        )
                );
            }
        })
    );

export const getChannel = (channelId) => async (dispatch) =>
    catchErrors(
        async () => {
            const data = await api.getChannel(channelId);

            dispatch({ type: 'channel/UPDATE_DATA', data });
        },
        () => dispatch(notify({ message: 'Error fetching channel data.' }))
    );

export const clearChannelData = () => (dispatch) =>
    dispatch({ type: 'channel/CLEAR_DATA' });

export const getChannelVideos = ({ channelId }) => async (dispatch, getState) =>
    catchErrors(
        async () => {
            const {
                channel: { nextPageToken: pageToken, hasNextPage }
            } = getState();

            if (!hasNextPage) {
                return;
            }

            const data = await api.getChannelVideos({ channelId, pageToken });

            dispatch({ type: 'channel/UPDATE_ITEMS', data });
        },
        () => dispatch(notify({ message: 'Error fetching channel videos.' }))
    );

export const clearChannelVideos = () => (dispatch) =>
    dispatch({ type: 'channel/CLEAR_ITEMS' });

/* Auth */
export const signIn = () => async (dispatch) =>
    catchErrors(
        async () => {
            const data = await api.signIn();

            dispatch({ type: 'auth/SIGN_IN', data });
        },
        () => dispatch(notify({ message: 'Error signing in user.' }))
    );

export const signOut = () => async (dispatch) =>
    catchErrors(
        async () => {
            await api.signOut();

            dispatch({ type: 'auth/SIGN_OUT' });
        },
        () => dispatch(notify({ message: 'Error signing out user.' }))
    );
