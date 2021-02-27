import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SCOPE } from '../config/api';
import { parseVideoData, parsePlaylistData, parseChannelData } from './parsers';
import { loadScript, parseVideoId, pick } from '../lib/helpers';

const ITEMS_PER_REQUEST = 50;

const loadAPI = async () => {
    await loadScript(API_URL);

    return window.gapi;
};

const getService = async (service) => {
    const gapi = await loadAPI();

    if (!gapi[service]) {
        await new Promise((callback) => gapi.load(service, { callback }));
    }

    return gapi[service];
};

const getAuthInstance = async () => {
    const auth2 = await getService('auth2');

    const params = {
        clientId: GOOGLE_CLIENT_ID,
        scope: GOOGLE_CLIENT_SCOPE
    };

    return auth2.init(params);
};

export const getSignedInUser = async () => {
    const GoogleAuth = await getAuthInstance();

    const isSignedIn = GoogleAuth.isSignedIn.get();

    const currentUser = GoogleAuth.currentUser.get();

    let user = {
        id: '',
        name: '',
        picture: ''
    };

    if (isSignedIn) {
        const userProfile = currentUser.getBasicProfile();

        user = {
            id: userProfile.getId(),
            name: userProfile.getName(),
            picture: userProfile.getImageUrl()
        };
    }

    const {
        id_token: idToken = '',
        access_token: accessToken = ''
    } = isSignedIn ? currentUser.getAuthResponse(true) : {};

    return {
        ...user,
        isSignedIn,
        idToken,
        accessToken
    };
};

export const signIn = async () => {
    const auth = await getAuthInstance();

    return auth.signIn({
        prompt: 'select_account'
    });
};

export const signOut = async () => {
    const auth = await getAuthInstance();

    return auth.signOut();
};

function removeEmptyParams(params = {}) {
    for (const p in params) {
        if (!params[p]) {
            delete params[p];
        }
    }
    return params;
}

const request = async (method = '', path = '', params = {}, body) => {
    const client = await getService('client');

    const { result } = await client.request({
        method,
        path: `/youtube/v3/${path}`,
        params: removeEmptyParams(params),
        ...(body ? { body } : {})
    });

    return result;
};

/* Videos */

export async function searchVideos({ query, forMine, pageToken }) {
    const {
        items: searchResults,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'search', {
        part: 'id, snippet',
        type: 'video',
        q: query,
        forMine: !!forMine,
        pageToken,
        maxResults: ITEMS_PER_REQUEST
    });

    let items = [];

    if (searchResults.length) {
        const videoIds = searchResults.map(({ id }) => id.videoId);

        items = await getVideosFromIds(videoIds);
    }

    return {
        items,
        nextPageToken: items.length !== totalResults ? nextPageToken : null,
        totalResults
    };
}

export async function getVideo(urlOrId = '') {
    const { items } = await request('GET', 'videos', {
        id: parseVideoId(urlOrId),
        part: 'contentDetails, snippet, status'
    });

    return parseVideoData(items[0]);
}

export async function getVideosFromIds(ids = []) {
    const { items } = await request('GET', 'videos', {
        part: 'contentDetails, snippet, status',
        id: ids.join(','),
        maxResults: ITEMS_PER_REQUEST
    });

    return items.map(parseVideoData);
}

/* Playlists */

export async function getPlaylists({
    pageToken = '',
    mine = false,
    channelId = '',
    ids = []
} = {}) {
    const {
        items,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'playlists', {
        pageToken,
        mine,
        id: ids.join(','),
        channelId,
        part: 'snippet, contentDetails, status',
        maxResults: ITEMS_PER_REQUEST
    });

    return {
        items: items.map(parsePlaylistData),
        nextPageToken,
        totalResults
    };
}

export async function getAllPlaylists({ mine = false } = {}) {
    let pageToken = '';
    let stack = [];

    while (pageToken !== null) {
        const { items, nextPageToken } = await getPlaylists({
            pageToken,
            mine
        });

        pageToken = nextPageToken || null;
        stack.push(...items);
    }

    return {
        items: stack,
        nextPageToken: pageToken,
        totalResults: stack.length
    };
}

export async function createPlaylist({ title, privacyStatus }) {
    const data = await request(
        'POST',
        'playlists',
        {
            part: 'snippet,status'
        },
        {
            snippet: {
                title
            },
            status: {
                privacyStatus
            }
        }
    );

    return parsePlaylistData(data);
}

export async function removePlaylist(id) {
    return request('DELETE', 'playlists', {
        id
    });
}

export async function getPlaylistTitle(id) {
    const { items } = await request('GET', 'playlists', {
        id,
        part: 'snippet'
    });

    const {
        snippet: { title }
    } = items[0];

    return title;
}

export async function getPlaylistItems({ pageToken = '', playlistId }) {
    const {
        items: playlistItems,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'playlistItems', {
        playlistId,
        pageToken,
        part: 'snippet, status',
        maxResults: ITEMS_PER_REQUEST
    });

    let items = [];

    if (playlistItems.length) {
        const videoIds = playlistItems.map(
            ({
                snippet: {
                    resourceId: { videoId }
                }
            }) => videoId
        );

        const videos = await getVideosFromIds(videoIds);

        items = videos.map((data, index) => ({
            ...data,
            playlistId,
            playlistItemId: playlistItems[index].id
        }));
    }

    return {
        items,
        nextPageToken,
        totalResults
    };
}

export async function addPlaylistItem(playlistId, videoId) {
    const data = await request(
        'POST',
        'playlistItems',
        { part: 'snippet' },
        {
            snippet: {
                playlistId,
                resourceId: {
                    kind: 'youtube#video',
                    videoId
                }
            }
        }
    );

    return parseVideoData(data);
}

export async function removePlaylistItem(id) {
    return request('DELETE', 'playlistItems', {
        id
    });
}
/* Subscriptions */
async function getChannelsFromIds(ids) {
    const { items } = await request('GET', 'channels', {
        part: 'snippet',
        id: ids.join(','),
        maxResults: ITEMS_PER_REQUEST
    });

    const channels = items.map(parseChannelData);

    return channels;
}

export async function getSubscriptions({ pageToken = '', mine = false }) {
    const {
        items: subscriptions,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'subscriptions', {
        pageToken,
        mine,
        part: 'id, snippet, contentDetails',
        maxResults: ITEMS_PER_REQUEST,
        order: 'alphabetical'
    });

    const channelIds = subscriptions.map(
        ({
            snippet: {
                resourceId: { channelId }
            }
        }) => channelId
    );

    const channels = await getChannelsFromIds(channelIds);

    return {
        items: channels.map((data) => {
            const index = subscriptions.findIndex(
                ({
                    snippet: {
                        resourceId: { channelId }
                    }
                }) => channelId === data.id
            );

            const matchingSubscription = subscriptions[index];

            const subscriptionProps = matchingSubscription
                ? {
                      subscriptionId: matchingSubscription.id,
                      ...pick(subscriptions[index].contentDetails, [
                          'totalItemCount',
                          'newItemCount'
                      ])
                  }
                : {};

            return {
                ...data,
                ...subscriptionProps,
                isUnsubscribed: false
            };
        }),
        nextPageToken,
        totalResults
    };
}

/* Channels */
export async function getChannel(id) {
    const { items } = await request('GET', 'channels', {
        id,
        part: 'snippet, contentDetails'
    });

    if (!items.length) {
        return {};
    }

    const {
        snippet: { title: channelTitle, thumbnails, description }
    } = items[0];

    return { channelTitle, description, thumbnails };
}

export async function getChannelVideos({ channelId, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
        part: 'snippet',
        type: 'video',
        order: 'date',
        channelId,
        pageToken,
        maxResults: ITEMS_PER_REQUEST
    });

    const videoIds = items.map(({ id: { videoId } }) => videoId);

    const videos = await getVideosFromIds(videoIds);

    return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
    };
}

export async function subscribeToChannel(channelId) {
    return request(
        'POST',
        'subscriptions',
        { part: 'snippet' },
        {
            snippet: {
                resourceId: {
                    kind: 'youtube#channel',
                    channelId
                }
            }
        }
    );
}

export async function unsubscribeFromChannel(id) {
    return request('DELETE', 'subscriptions', { id });
}
