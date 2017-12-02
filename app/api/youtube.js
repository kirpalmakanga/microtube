// https://apis.google.com/js/client.js

const API_KEY = 'AIzaSyCLDBo0aNwTTOp6yQMaD9b4mQX4B_rT2NE'
const ITEMS_PER_REQUEST = 20

function parseID(url){
  var ID = ''

  url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/)

  if(url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i)
    ID = ID[0]
  }
  else {
    ID = url.toString()
  }
  return ID
}

function getClient() {
  return new Promise((resolve) => {
    const watcher = setInterval(() => {
      if(gapi && gapi.client) {
        clearInterval(watcher)
        resolve(gapi.client)
      }
    }, 100)
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

function request(method, path, params, properties) {
  const config = {
      method,
      path: `/youtube/v3/${path}`,
      params: removeEmptyParams(params)
  }

  if (properties) {
    config.body = createResource(properties)
  }

  return new Promise(async (resolve) => {
    const client = await getClient()

    client.request(config)
    .execute(resolve)
  })
}

/* Videos */

export async function searchVideos ({ query, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
      part: 'snippet',
      type: 'video',
      q: query,
      pageToken,
      maxResults: ITEMS_PER_REQUEST,
    })

    const videoIds = items.map(({ id }) => id.videoId)

    const videos = await getVideosFromIds(videoIds)

    return {
      items: videos,
      nextPageToken,
      totalResults: pageInfo.totalResults
    }
}

export async function getVideo (urlOrId) {
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

export async function getVideosFromIds (ids) {
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

export async function getPlaylists ({ pageToken = '', mine = false }) {
  const { items, nextPageToken, pageInfo } = await request('GET', 'playlists', {
    pageToken,
    mine,
    part: 'snippet, contentDetails, status',
    maxResults: ITEMS_PER_REQUEST
  })

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

export async function getPlaylistTitle (id) {
  const { items } = await request('GET', 'playlists', {
    id,
    part: 'snippet'
  })

  const { title } = items[0].snippet

  return title
}

export async function getPlaylistItems ({ pageToken = '', playlistId }) {
  const { items, nextPageToken, pageInfo } = await request('GET', 'playlistItems', {
    playlistId,
    pageToken,
    part: 'snippet, status',
    maxResults: ITEMS_PER_REQUEST
  })

  const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId)

  const videos = await getVideosFromIds(videoIds)

  return {
    items: videos,
    nextPageToken,
    totalResults: pageInfo.totalResults
  }
}

/* Subscriptions */

export async function getSubscriptions ({ pageToken = '', mine = false }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'subscriptions', {
      pageToken,
      mine,
      part: 'id, snippet, contentDetails',
      maxResults: ITEMS_PER_REQUEST,
      order: 'alphabetical'
    })

    return {
      items: items.map(({ id, contentDetails, snippet }) => ({
        id,
        channelId: snippet.resourceId.channelId,
        title: snippet.title,
        itemCount: contentDetails.totalItemCount
      })),
      nextPageToken,
      totalResults: pageInfo.totalResults
    }
}

/* Channels */

export async function getChannelTitle (id) {
  const { items } = await request('GET', 'channels', {
    id,
    part: 'snippet'
  })

  const { title } = items[0].snippet

  return title
}

export async function getChannelVideos ({ channelId, pageToken }) {
    const { items, nextPageToken, pageInfo } = await request('GET', 'search', {
      part: 'snippet',
      type: 'video',
      channelId,
      pageToken,
      maxResults: ITEMS_PER_REQUEST,
    })

    const videoIds = items.map(({ id }) => id.videoId)

    const videos = await getVideosFromIds(videoIds)

    return {
      items: videos,
      nextPageToken,
      totalResults: pageInfo.totalResults
    }
}
