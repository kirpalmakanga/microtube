// jshint esversion: 6, asi: true
// eslint-env es6

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
      youtube[field].list(config).execute(response => {
        if (response.error) {
          return reject(response.message)
        }

        resolve(response)
      })
    })
    .catch(err => console.error(err))
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

exports.searchVideos = (accessToken, query, pageToken) => {
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
