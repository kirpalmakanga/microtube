// https://apis.google.com/js/client.js

import {
    API_KEY,
    API_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SCOPE
} from '../config'

const ITEMS_PER_REQUEST = 50

function parseID(url) {
    var ID = ''

    url = url
        .replace(/(>|<)/gi, '')
        .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)

    if (url[2] !== undefined) {
        ID = url[2].split(/[^0-9a-z_\-]/i)
        ID = ID[0]
    } else {
        ID = url.toString()
    }
    return ID
}

export const loadAPI = () => {
    return new Promise((resolve) => {
        ;((d, s, cb) => {
            const url = API_URL
            const element = d.getElementsByTagName(s)[0]
            const fjs = element
            let js = element

            if (!d.querySelector(`script[src="${url}"]`)) {
                js = d.createElement(s)
                js.src = url
                fjs.parentNode.insertBefore(js, fjs)
                js.onload = () => cb(true)
            } else {
                cb()
            }
        })(document, 'script', async (initServices) => {
            const { gapi } = window

            if (initServices) {
                await Promise.all([
                    new Promise((callback) =>
                        gapi.load('auth2', {
                            callback
                        })
                    ),
                    new Promise((callback) =>
                        gapi.load('client', {
                            callback
                        })
                    )
                ])
            }

            resolve(gapi)
        })
    })
}

export const getAuthInstance = () => {
    const { auth2 } = window.gapi

    const params = {
        clientId: GOOGLE_CLIENT_ID,
        scope: GOOGLE_CLIENT_SCOPE
    }

    return auth2.init(params)
}

export const getClient = () => {
    const { client } = window.gapi

    // const params = {
    //     clientId: GOOGLE_CLIENT_ID,
    //     scope: GOOGLE_CLIENT_SCOPE
    // }

    // client.init(params)

    return client
}

export const listenAuth = (callback) => {
    const GoogleAuth = getAuthInstance()

    GoogleAuth.then(() => {
        const hasAuthenticatedUser = GoogleAuth.isSignedIn.get()

        const getUser = () => {
            const {
                Zi,
                w3: { Paa: picture = '', ig = '', ofa = '' }
            } = GoogleAuth.currentUser.get()

            const userName = ig || ofa

            return {
                picture,
                userName
            }
        }

        const sendData = (isSignedIn) =>
            isSignedIn &&
            callback({
                user: getUser(),
                isSignedIn
            })

        if (hasAuthenticatedUser) {
            sendData(hasAuthenticatedUser)
        }

        GoogleAuth.isSignedIn.listen(sendData)
    })
}

function createResource(properties) {
    var resource = {}
    var normalizedProps = properties

    for (let p in properties) {
        var value = properties[p]
        if (p && p.substr(-2, 2) == '[]') {
            const adjustedName = p.replace('[]', '')
            if (value) {
                normalizedProps[adjustedName] = value.split(',')
            }
            delete normalizedProps[p]
        }
    }

    for (const p in normalizedProps) {
        // Leave properties that don't have values out of inserted resource.
        if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
            const propArray = p.split('.')
            let ref = resource

            for (let pa = 0; pa < propArray.length; pa++) {
                const key = propArray[pa]

                if (pa === propArray.length - 1) {
                    ref[key] = normalizedProps[p]
                } else {
                    ref = ref[key] = ref[key] || {}
                }
            }
        }
    }

    return resource
}

function removeEmptyParams(params) {
    for (const p in params) {
        if (!params[p] || params[p] == 'undefined') {
            delete params[p]
        }
    }
    return params
}

const request = async (method, path, params, properties) => {
    const client = getClient()

    const config = {
        method,
        path: `/youtube/v3/${path}`,
        params: removeEmptyParams(params)
    }

    if (properties) {
        config.body = createResource(properties)
    }

    const { result } = await client.request(config)

    return result
}

/* Videos */

export async function searchVideos({ query, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
        part: 'snippet',
        type: 'video',
        q: query,
        pageToken,
        maxResults: ITEMS_PER_REQUEST
    })

    const videoIds = items.map(({ id }) => id.videoId)

    const videos = await getVideosFromIds(videoIds)

    return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
    }
}

export async function getVideo(urlOrId) {
    const { items } = await request('GET', 'videos', {
        id: parseID(urlOrId),
        part: 'contentDetails, snippet, status'
    })

    const { id, contentDetails, snippet, status } = items[0]

    return {
        videoId: id,
        title: snippet.title,
        duration: contentDetails.duration,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        privacyStatus: status.privacyStatus
    }
}

export async function getVideosFromIds(ids) {
    const { items } = await request('GET', 'videos', {
        part: 'contentDetails, snippet, status',
        id: ids.join(', '),
        maxResults: ITEMS_PER_REQUEST
    })

    const videos = items.map(({ id, contentDetails, snippet, status }) => ({
        videoId: id,
        title: snippet.title,
        thumbnails: snippet.thumbnails,
        duration: contentDetails.duration,
        publishedAt: snippet.publishedAt,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        privacyStatus: status.privacyStatus
    }))

    return videos
}

/* Playlists */

export async function getPlaylists({ pageToken = '', mine = false }) {
    const { items, nextPageToken, pageInfo } = await request(
        'GET',
        'playlists',
        {
            pageToken,
            mine,
            part: 'snippet, contentDetails, status',
            maxResults: ITEMS_PER_REQUEST
        }
    )

    return {
        items: items.map(({ id, contentDetails, snippet, status }) => ({
            id,
            title: snippet.title,
            thumbnails: snippet.thumbnails,
            itemCount: contentDetails.itemCount,
            privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
    }
}

export async function getPlaylistTitle(id) {
    const { items } = await request('GET', 'playlists', {
        id,
        part: 'snippet'
    })

    const { title } = items[0].snippet

    return title
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
    )

    const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId)

    const videos = await getVideosFromIds(videoIds)

    return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
    }
}

/* Subscriptions */

export async function getSubscriptions({ pageToken = '', mine = false }) {
    const { items, nextPageToken, pageInfo } = await request(
        'GET',
        'subscriptions',
        {
            pageToken,
            mine,
            part: 'id, snippet, contentDetails',
            maxResults: ITEMS_PER_REQUEST,
            order: 'alphabetical'
        }
    )

    return {
        items: items.map(({ id, contentDetails, snippet }) => ({
            id,
            channelId: snippet.resourceId.channelId,
            title: snippet.title,
            thumbnails: snippet.thumbnails,
            itemCount: contentDetails.totalItemCount
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
    }
}

/* Channels */
export async function getChannelId(forUsername) {
    const { items } = await request('GET', 'channels', {
        forUsername,
        part: 'snippet'
    })

    const { id } = items[0]

    return id
}

export async function getChannelTitle(id) {
    const { items } = await request('GET', 'channels', {
        id,
        part: 'snippet'
    })

    const { title } = items[0].snippet

    return title
}

export async function getChannelVideos({ channelId, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
        part: 'snippet',
        type: 'video',
        channelId,
        pageToken,
        maxResults: ITEMS_PER_REQUEST
    })

    const videoIds = items.map(({ id }) => id.videoId)

    const videos = await getVideosFromIds(videoIds)

    return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
    }
}
