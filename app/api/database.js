// jshint esversion: 6, asi: true
// eslint-env es6

const apiKey = 'AIzaSyCLDBo0aNwTTOp6yQMaD9b4mQX4B_rT2NE'
const OAUTH2_CLIENT_ID = '440745412600-snpeajuh0l9tqfrt356mec6j3mdn8eoo.apps.googleusercontent.com'
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube']

function loadApi() {
  return new Promise((resolve, reject) => {
    gapi.client.setApiKey(apiKey)
    gapi.client.load('youtube', 'v3', function() {
      resolve(gapi.client.youtube)
    })
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
      part: 'snippet, status',
      mine: true,
      maxResults: 25,
      key: apiKey
    }).then(({ items, nextPageToken, pageInfo }) => {
      resolve({
        items: items.map(({ id, snippet, status }) => ({
          id,
          title: snippet.title,
          privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    }).catch(message => {

    })
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
    }).then(({ items, nextPageToken, pageInfo }) => {
      resolve({
        items: items.map(({ id, snippet, status }) => ({
          id,
          videoId: snippet.resourceId.videoId,
          title: snippet.title,
          publishedAt: snippet.publishedAt,
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
          privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    }).catch(message => {

    })
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
    }).then(({ items, nextPageToken, pageInfo }) => {
      resolve({
        items: items.map(({ id, snippet, status }) => ({
          videoId: id.videoId,
          title: snippet.title,
          channelId: snippet.channelId,
          channelTitle: snippet.channelTitle,
          publishedAt: snippet.publishedAt
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    }).catch(message => {

    })
  })
}
