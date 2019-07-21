import * as api from '../api/youtube';
import * as database from '../api/firebase';

import { delay, catchErrors, parseID, splitLines, chunk } from '../lib/helpers';

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

/* Auth */
export const getUserData = () => async (dispatch) => {
    const data = api.getSignedInUser();

    const { isSignedIn, idToken, accessToken } = data;

    if (!isSignedIn) {
        return;
    }

    const {
        user: { uid }
    } = await database.signIn(idToken, accessToken);

    const { queue = [] } = (await database.get(`users/${uid}`)) || {};

    data.user.id = uid;

    dispatch({ type: 'auth/UPDATE_DATA', data });

    if (queue.length) {
        dispatch({
            type: 'player/UPDATE_QUEUE',
            data: { queue }
        });
    }
};

export const signIn = () => async (dispatch) =>
    catchErrors(
        async () => {
            await api.signIn();

            return dispatch(getUserData());
        },
        () => dispatch(notify({ message: 'Error signing in user.' }))
    );

export const signOut = () => async (dispatch) =>
    catchErrors(
        async () => {
            await api.signOut();

            await database.signOut();

            dispatch({ type: 'auth/SIGN_OUT' });
        },
        () => dispatch(notify({ message: 'Error signing out user.' }))
    );

export const listenAuthChange = () => (dispatch) =>
    api.listenAuth(() => dispatch(getUserData()));

export const closeScreen = () => (dispatch, getState) => {
    const {
        player: { showScreen }
    } = getState();

    showScreen && dispatch({ type: 'player/CLOSE_SCREEN' });
};

/* Playlists */
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
    return (dispatch) =>
        dispatch(
            prompt(
                {
                    promptText: `Remove ${title} ?`,
                    confirmText: 'Remove'
                },
                () => {
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
                    );
                }
            )
        );
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
    return async (dispatch) =>
        dispatch(
            prompt(
                {
                    promptText: `Remove "${title}" ?`,
                    confirmText: 'Remove'
                },
                () => {
                    catchErrors(
                        () => {
                            dispatch({
                                type: 'playlist/REMOVE_ITEM',
                                data: { playlistItemId, playlistId }
                            });

                            dispatch(
                                notify({
                                    message: `Removed ${title}.`
                                })
                            );

                            return api.removePlaylistItem(playlistItemId);
                        },
                        () =>
                            dispatch(
                                notify({
                                    message: 'Error deleting playlist item.'
                                })
                            )
                    );
                }
            )
        );
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
            prompt(
                {
                    mode: 'playlist',
                    promptText: `Add to playlist`,
                    confirmText: 'Done'
                },
                ({
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
            )
        );
}

/* Player */
const saveQueue = () => async (_, getState) => {
    const {
        auth: {
            isSignedIn,
            user: { id: userId }
        },
        player: { queue }
    } = getState();

    if (isSignedIn) {
        database.set(`users/${userId}`, { queue });
    }
};

export const saveVolume = (data) => (dispatch) =>
    dispatch({ type: 'player/SET_VOLUME', data });

export const saveCurrentTime = (data) => (dispatch) =>
    dispatch({ type: 'player/SET_CURRENT_TIME', data });

export const toggleQueue = () => (dispatch, getState) => {
    const {
        player: { showQueue }
    } = getState();

    dispatch({
        type: showQueue ? 'player/CLOSE_QUEUE' : 'player/OPEN_QUEUE'
    });
};

export const toggleScreen = () => (dispatch, getState) => {
    const {
        player: { showScreen }
    } = getState();

    dispatch({
        type: showScreen ? 'player/CLOSE_SCREEN' : 'player/OPEN_SCREEN'
    });
};

export const queueItems = (items) => (dispatch) => {
    dispatch({ type: 'player/QUEUE_PUSH', items });

    dispatch(saveQueue());
};

export const queueItem = (data) => (dispatch) =>
    dispatch({ type: 'player/QUEUE_PUSH', items: [data] });

export const setQueue = (queue) => (dispatch) => {
    dispatch({ type: 'player/UPDATE_QUEUE', data: { queue } });

    dispatch(saveQueue());
};

export const removeQueueItem = (index) => (dispatch) => {
    dispatch({ type: 'player/REMOVE_QUEUE_ITEM', data: index });

    dispatch(saveQueue());
};

export const clearQueue = () => (dispatch) =>
    dispatch(
        prompt(
            {
                promptText: 'Clear the queue ?',
                confirmText: 'Clear'
            },
            () => {
                dispatch({ type: 'player/CLEAR_QUEUE' });

                dispatch(saveQueue());
            }
        )
    );

export const setActiveQueueItem = (index) => (dispatch) => {
    dispatch({
        type: 'player/SET_ACTIVE_QUEUE_ITEM',
        data: { index }
    });

    dispatch(saveQueue());
};

export const playItem = (data) => (dispatch) => {
    dispatch(queueItem(data));

    dispatch(setActiveQueueItem());
};

export function queuePlaylist({ playlistId, play }) {
    return (dispatch, getState) => {
        const {
            player: { queue }
        } = getState();

        const getItems = async (pageToken) => {
            const { items, nextPageToken } = await api.getPlaylistItems({
                playlistId,
                pageToken
            });

            dispatch(queueItems(items));

            if (play && !pageToken && items.length) {
                const index = queue.length;

                dispatch(setActiveQueueItem(newIndex));
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

export const queueVideos = (ids = []) => (dispatch) =>
    catchErrors(
        async () => {
            const items = await api.getVideosFromIds(ids);

            dispatch(queueItems(items));
        },
        () => dispatch(notify({ message: 'Error queuing videos.' }))
    );

export const importVideos = () => (dispatch) =>
    dispatch(
        prompt(
            {
                promptText: 'Import videos',
                confirmText: 'Import',
                form: true
            },
            async (text) => {
                const lines = splitLines(text).filter(Boolean);

                if (!lines.length) {
                    return;
                }

                const videoIds = [...new Set(lines.map(parseID))];

                const chunks = chunk(videoIds, 50);

                for (const ids of chunks) {
                    await dispatch(queueVideos(ids));
                }
            }
        )
    );

/* Search */
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
        prompt(
            {
                promptText: `Unsubscribe from ${channelTitle}`,
                confirmText: 'Done'
            },
            () => {
                catchErrors(
                    () => {
                        dispatch({
                            type: 'subscriptions/UNSUBSCRIBE',
                            data: { subscriptionId }
                        });

                        return api.unsubscribeFromChannel(subscriptionId);
                    },
                    () =>
                        dispatch(
                            notify({
                                message: 'Error unsubscribing to channel.'
                            })
                        )
                );
            }
        )
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
