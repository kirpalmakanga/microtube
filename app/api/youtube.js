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

class Api {
  constructor() {
    this.loadApi = () => new Promise((resolve, reject) => {
      const waitForAPI = setInterval(() => {
        if(gapi && gapi.client) {
          clearInterval(waitForAPI)
          gapi.client.load('youtube', 'v3', () => resolve(gapi.client.youtube))
        }
      }, 100)
    })
  }

  list = (field, config) => new Promise(async (resolve, reject) => {
    try {
      const youtube = await this.loadApi()

      youtube[field].list(config).execute(res => {
        if (res.error) {
            return reject(res.message)
        }
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })

  remove = (field, config) => new Promise(async (resolve, reject) => {
    try {
      const youtube = await this.loadApi()

      youtube[field].delete(config).execute(res => {
        if (res.error) {
            return reject(res.message)
        }
        resolve(res)
      })
    } catch (err) {
      reject(err)
    }
  })

  getVideosFromIds = (ids, accessToken) => new Promise(async (resolve, reject) => {
    try {
      const { items } = await this.list('videos', {
        access_token: accessToken,
        part: 'contentDetails, snippet, status',
        id: ids.join(', '),
        maxResults: ITEMS_PER_REQUEST,
        key: API_KEY
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

      resolve(videos)
    } catch (err) {
      reject(err)
    }
  })

  getPlaylists = async (accessToken, pageToken = '') => new Promise(async (resolve, reject) => {
    try {
      const { items, nextPageToken, pageInfo } = await this.list('playlists', {
        access_token: accessToken,
        pageToken,
        part: 'snippet, contentDetails, status',
        mine: true,
        maxResults: ITEMS_PER_REQUEST,
        key: API_KEY
      })

      resolve({
        items: items.map(({ id, contentDetails, snippet, status }) => ({
          id,
          title: snippet.title,
          thumbnails: snippet.thumbnails,
          itemCount: contentDetails.itemCount,
          privacyStatus: status.privacyStatus
        })),
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    } catch (err) {
      reject(err)
    }
  })

  getPlaylistItems = (accessToken, playlistId, pageToken = '') => new Promise(async (resolve, reject) => {
    try {
      const { items, nextPageToken, pageInfo } = await this.list('playlistItems', {
        access_token: accessToken,
        playlistId,
        pageToken,
        part: 'snippet, status',
        maxResults: ITEMS_PER_REQUEST,
        key: API_KEY
      })

      const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      resolve({
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      })

    } catch (err) {
      reject(err)
    }
  })

  searchVideos = (accessToken, query, pageToken, channelId) => new Promise(async (resolve, reject) => {
    try {
      const { items, nextPageToken, pageInfo } = await this.list('search', {
        access_token: accessToken,
        part: 'snippet',
        type: 'video',
        q: query,
        pageToken,
        key: API_KEY,
        maxResults: ITEMS_PER_REQUEST,
      })

      const videoIds = items.map(({ id }) => id.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      resolve({
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    } catch (err) {
      reject(err)
    }
  })

  getVideo = (accessToken, urlOrId) => new Promise(async (resolve, reject) => {
    try {
      const { items } = await this.list('videos', {
        access_token: accessToken,
        id: parseID(urlOrId),
        part: 'contentDetails, snippet, status',
        key: API_KEY
      })

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
    } catch (err) {
      reject(err)
    }
  })

  getSubscriptions = (accessToken, pageToken = '') => new Promise(async (resolve, reject) => {
    try {
      const { items, nextPageToken, pageInfo } = await this.list('subscriptions', {
        access_token: accessToken,
        pageToken,
        part: 'id, snippet, contentDetails',
        mine: true,
        maxResults: ITEMS_PER_REQUEST,
        order: 'alphabetical',
        key: API_KEY
      })

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
    } catch (err) {
      reject(err)
    }
  })

  getChannelVideos = (accessToken, channelId, pageToken) => new Promise(async (resolve, reject) => {
    try {
      const { items, nextPageToken, pageInfo } = await this.list('search', {
        access_token: accessToken,
        part: 'snippet',
        type: 'video',
        channelId,
        pageToken,
        key: API_KEY,
        maxResults: ITEMS_PER_REQUEST,
      })

      const videoIds = items.map(({ id }) => id.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      resolve({
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      })
    } catch (err) {
      reject(err)
    }
  })
}

export default new Api()
