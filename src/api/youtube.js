import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SCOPE } from '../config/api';
import { parseVideoData, parsePlaylistData, parseChannelData } from './parsers';
import { pick } from '../lib/helpers';

const ITEMS_PER_REQUEST = 50;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        try {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const js = document.createElement('script');

                document.body.appendChild(js);

                js.src = src;
                js.onload = () => resolve(true);
            } else {
                resolve(false);
            }
        } catch (err) {
            reject(err);
        }
    });
}

export const loadAPI = async () => {
    const initServices = await loadScript(API_URL);

    const { gapi } = window;

    if (initServices) {
        await new Promise((callback) =>
            gapi.load('client:auth2', { callback })
        );
    }

    return gapi;
};

export const getAuthInstance = () => {
    const { auth2 } = window.gapi;

    const params = {
        clientId: GOOGLE_CLIENT_ID,
        scope: GOOGLE_CLIENT_SCOPE
    };

    return auth2.init(params);
};

export const loadAuth = () => {
    const GoogleAuth = getAuthInstance();

    return GoogleAuth;
};

export const getSignedInUser = () => {
    const GoogleAuth = getAuthInstance();

    const isSignedIn = GoogleAuth.isSignedIn.get();

    const currentUser = GoogleAuth.currentUser.get();

    const {
        w3: { Eea: id = '', Paa: picture = '', ig = '', ofa = '' } = {}
    } = currentUser;

    const name = ig || ofa;

    const {
        id_token: idToken = '',
        access_token: accessToken = ''
    } = isSignedIn ? currentUser.getAuthResponse(true) : {};

    return {
        isSignedIn,
        idToken,
        accessToken,
        user: {
            id,
            picture,
            name
        }
    };
};

export const signIn = async () => {
    await getAuthInstance().signIn();

    return getSignedInUser();
};

export const signOut = () => getAuthInstance().signOut();

export const listenAuth = (callback) =>
    getAuthInstance().isSignedIn.listen(
        (isSignedIn) => isSignedIn && callback(getSignedInUser())
    );

function createResource(properties) {
    var resource = {};
    var normalizedProps = properties;

    for (let p in properties) {
        var value = properties[p];
        if (p && p.substr(-2, 2) == '[]') {
            const adjustedName = p.replace('[]', '');
            if (value) {
                normalizedProps[adjustedName] = value.split(',');
            }
            delete normalizedProps[p];
        }
    }

    for (const p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
            const propArray = p.split('.');
            let ref = resource;

            for (let pa = 0; pa < propArray.length; pa++) {
                const key = propArray[pa];

                if (pa === propArray.length - 1) {
                    ref[key] = normalizedProps[p];
                } else {
                    ref = ref[key] = ref[key] || {};
                }
            }
        }
    }

    return resource;
}

function removeEmptyParams(params) {
    for (const p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p];
        }
    }
    return params;
}

const request = async (method, path, params, properties) => {
    const { client } = window.gapi;

    const config = {
        method,
        path: `/youtube/v3/${path}`,
        params: removeEmptyParams(params)
    };

    if (properties) {
        config.body = createResource(properties);
    }

    const { result } = await client.request(config);

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

export async function getVideo(urlOrId) {
    const { items } = await request('GET', 'videos', {
        id: parseID(urlOrId),
        part: 'contentDetails, snippet, status'
    });

    return parseVideoData(items[0]);
}

export async function getVideosFromIds(ids) {
    const { items } = await request('GET', 'videos', {
        part: 'contentDetails, snippet, status',
        id: ids.join(', '),
        maxResults: ITEMS_PER_REQUEST
    });

    const videos = items.map(parseVideoData);

    return videos;
}

/* Playlists */

export async function getPlaylists({
    pageToken = '',
    mine = false,
    channelId = ''
} = {}) {
    const {
        items,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'playlists', {
        pageToken,
        mine,
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
    return request(
        'POST',
        'playlists',
        {
            part: 'snippet,status'
        },
        {
            'snippet.title': title,
            'status.privacyStatus': privacyStatus
        }
    );
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
    return request(
        'POST',
        'playlistItems',
        { part: 'snippet' },
        {
            'snippet.playlistId': playlistId,
            'snippet.resourceId.kind': 'youtube#video',
            'snippet.resourceId.videoId': videoId
        }
    );
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
        id: ids.join(', '),
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
            'snippet.resourceId.kind': 'youtube#channel',
            'snippet.resourceId.channelId': channelId
        }
    );
}

export async function unsubscribeFromChannel(id) {
    return request('DELETE', 'subscriptions', { id });
}
