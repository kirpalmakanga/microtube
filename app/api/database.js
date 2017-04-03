const apiKey = 'AIzaSyCLDBo0aNwTTOp6yQMaD9b4mQX4B_rT2NE'

function loadApi() {
  return new Promise((resolve, reject) => {
    const waitForAPI = setInterval(() => {
      if(gapi) {
        clearInterval(waitForAPI)
        gapi.client.load('youtube', 'v3', () => resolve(gapi.client.youtube))
      }
    }, 100)
  })
}

function request(field, config) {
  return new Promise((resolve, reject) => {
    loadApi()
    .then(youtube => {
      youtube[field].list(config).execute(res => res.error ? reject(res.message) : resolve(res))
    })
    .catch(err => reject(err))
  })
}

function remove(field, config) {
  return new Promise((resolve, reject) => {
    loadApi()
    .then(youtube => {
      youtube[field].delete(config).execute(res => res.error ? reject(res.message) : resolve(res))
    })
    .catch(err => reject(err))
  })
}

exports.getPlaylists = (accessToken, pageToken = '') => {
  return new Promise((resolve, reject) => {
    request('playlists', {
      access_token: accessToken,
      pageToken,
      part: 'snippet, contentDetails, status',
      mine: true,
      maxResults: 25,
      key: apiKey
    })
    .then(({ items, nextPageToken, pageInfo }) => {
      resolve({
        items: items.map(({ id, contentDetails, snippet, status }) => ({
          id,
          thumb: snippet.thumbnails.medium.url,
          title: snippet.title,
          itemCount: contentDetails.itemCount,
          privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    })
    .catch(message => reject(message))
  })
}

exports.getPlaylistItems = (accessToken, playlistId, pageToken = '') => {
  return new Promise((resolve, reject) => {
    request('playlistItems', {
      access_token: accessToken,
      playlistId,
      pageToken,
      part: 'snippet, status',
      maxResults: 50,
      key: apiKey
    })
    .then(({ items, nextPageToken, pageInfo }) => {
      const playlistItemIds = items.map(({ id }) => id)
      const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId).join(', ')

      request('videos', {
        access_token: accessToken,
        part: 'contentDetails, snippet, status',
        id: videoIds,
        maxResults: 50,
        key: apiKey
      })
      .then(({ items }) => {

        resolve({
          items: items.map(({ id, contentDetails, snippet, status }, i) => ({
            id: playlistItemIds[i],
            videoId: id,
            thumb: snippet.thumbnails.medium.url,
            title: snippet.title,
            duration: contentDetails.duration,
            publishedAt: snippet.publishedAt,
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            privacyStatus: status.privacyStatus
          })),
          nextPageToken,
          totalResults: pageInfo.totalResults
        })

      })
      .catch(message => reject(message))
    })
    .catch(message => reject(message))
  })
}

exports.searchVideos = (accessToken, query, pageToken, channelId) => {
  return new Promise((resolve, reject) => {
    request('search', {
      access_token: accessToken,
      part: 'snippet',
      type: 'video',
      q: query,
      pageToken,
      key: apiKey,
      maxResults: 50,
    })
    .then(({ items, nextPageToken, pageInfo }) => {
      const ids = items.map(({ id }) => id.videoId).join(', ')

      request('videos', {
        access_token: accessToken,
        part: 'contentDetails, snippet, status',
        id: ids,
        maxResults: 50,
        key: apiKey
      })
      .then(({ items }) => {
        resolve({
          items: items.map(({ id, contentDetails, snippet, status }, i) => ({
            videoId: id,
            title: snippet.title,
            duration: contentDetails.duration,
            publishedAt: snippet.publishedAt,
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            privacyStatus: status.privacyStatus
          })),
          nextPageToken,
          totalResults: pageInfo.totalResults
        })

      })
      .catch(message => reject(message))
    })
    .catch(message => reject(message))
  })
}

exports.getVideo = (accessToken, urlOrId) => {

  function getYouTubeID(url){
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

  return new Promise((resolve, reject) => {
    request('videos', {
      access_token: accessToken,
      id: getYouTubeID(urlOrId),
      part: 'contentDetails, snippet, status',
      key: apiKey
    })
    .then(({ items }) => {
      const { id, contentDetails, snippet, status } = items[0]

      resolve({
        videoId: id,
        title: snippet.title,
        duration: contentDetails.duration,
        channelId: snippet.channelId,
        channelTitle: snippet.channelTitle,
        publishedAt: snippet.publishedAt,
        privacyStatus: status.privacyStatus
      })
    })
    .catch(message => reject(message))
  })
}

exports.getSubscriptions = (accessToken, pageToken = '') => {
  return new Promise((resolve, reject) => {
    request('subscriptions', {
      access_token: accessToken,
      pageToken,
      part: 'id, snippet, contentDetails',
      mine: true,
      maxResults: 25,
      order: 'alphabetical',
      key: apiKey
    })
    .then(({ items, nextPageToken, pageInfo }) => {
      resolve({
        items: items.map(({ id, contentDetails, snippet }) => ({
          id,
          channelId: snippet.resourceId.channelId,
          title: snippet.title,
          itemCount: contentDetails.totalItemCount
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    })
    .catch(message => reject(message))
  })
}

exports.unsubscribe = (accessToken, id) => {
  return new Promise((resolve, reject) => {
    remove('subscriptions', {
      access_token: accessToken,
      id,
      key: apiKey
    })
    .then(data => resolve(data))
    .catch(message => reject(message))
  })
}

exports.getChannelVideos = (accessToken, channelId, pageToken) => {
  return new Promise((resolve, reject) => {
    request('search', {
      access_token: accessToken,
      part: 'snippet',
      type: 'video',
      channelId,
      pageToken,
      key: apiKey,
      maxResults: 50,
    })
    .then(({ items, nextPageToken, pageInfo }) => {
      const ids = items.map(({ id }) => id.videoId).join(', ')

      request('videos', {
        access_token: accessToken,
        part: 'contentDetails, snippet, status',
        id: ids,
        maxResults: 50,
        key: apiKey
      })
      .then(({ items }) => {
        resolve({
          items: items.map(({ id, contentDetails, snippet, status }, i) => ({
            videoId: id,
            title: snippet.title,
            duration: contentDetails.duration,
            publishedAt: snippet.publishedAt,
            channelId: snippet.channelId,
            channelTitle: snippet.channelTitle,
            privacyStatus: status.privacyStatus
          })),
          nextPageToken,
          totalResults: pageInfo.totalResults
        })

      })
      .catch(message => reject(message))
    })
    .catch(message => reject(message))
  })
}
