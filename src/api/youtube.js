import { API_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SCOPE } from '../config/api';
import { parseVideoData, parsePlaylistData } from './parsers';

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

export const signIn = async () => {
    const auth = getAuthInstance();

    const data = await auth.signIn();

    const { w3: { Paa: picture = '', ig = '', ofa = '' } = {} } = data;

    const userName = ig || ofa;

    return {
        user: { picture, userName },
        isSignedIn: true
    };
};

export const signOut = async () => {
    const auth = getAuthInstance();

    return auth.signOut();
};

export const getSignedInUser = () => {
    const GoogleAuth = getAuthInstance();

    const isSignedIn = GoogleAuth.isSignedIn.get();

    const {
        w3: { Paa: picture = '', ig = '', ofa = '' } = {}
    } = GoogleAuth.currentUser.get();

    const userName = ig || ofa;

    return {
        isSignedIn,
        user: {
            picture,
            userName
        }
    };
};

export const listenAuth = (callback) =>
    getAuthInstance().isSignedIn.listen(
        (isSignedIn) =>
            isSignedIn &&
            callback({
                user: getSignedInUser(),
                isSignedIn
            })
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
        items,
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

    const videoIds = items.map(({ id }) => id.videoId);

    const videos = await getVideosFromIds(videoIds);

    return {
        items: videos,
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

export async function getPlaylists({ pageToken = '', mine = false } = {}) {
    const {
        items,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'playlists', {
        pageToken,
        mine,
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
    const { items, nextPageToken, pageInfo } = await request(
        'GET',
        'playlistItems',
        {
            playlistId,
            pageToken,
            part: 'snippet, status',
            maxResults: ITEMS_PER_REQUEST
        }
    );

    const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId);

    const videos = await getVideosFromIds(videoIds);

    return {
        items: videos.map((data, index) => ({
            ...data,
            playlistItemId: items[index].id
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
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

const parseSubscriptionData = ({
    id,
    contentDetails: { totalItemCount: itemCount },
    snippet: {
        title,
        thumbnails,
        resourceId: { channelId }
    }
}) => ({
    id,
    channelId,
    title,
    thumbnails,
    itemCount
});

export async function getSubscriptions({ pageToken = '', mine = false }) {
    const {
        items,
        nextPageToken,
        pageInfo: { totalResults }
    } = await request('GET', 'subscriptions', {
        pageToken,
        mine,
        part: 'id, snippet, contentDetails',
        maxResults: ITEMS_PER_REQUEST,
        order: 'alphabetical'
    });

    return {
        items: items.map(parseSubscriptionData),
        nextPageToken,
        totalResults
    };
}

/* Channels */
export async function getChannelId(forUsername) {
    const { items } = await request('GET', 'channels', {
        forUsername,
        part: 'snippet'
    });

    const { id } = items[0];

    return id;
}

export async function getChannelTitle(id) {
    const { items } = await request('GET', 'channels', {
        id,
        part: 'snippet'
    });

    const { title } = items[0].snippet;

    return title;
}

export async function getChannelVideos({ channelId, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
        part: 'snippet',
        type: 'video',
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
