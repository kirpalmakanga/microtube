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

  callApi = (action, field, config) => new Promise(async (resolve, reject) => {
      const youtube = await this.loadApi()

      youtube[field]
      .list({ ...config, key: API_KEY })
      .execute(res => res.error ? reject(res.message) : resolve(res))
  })

  list = (...args) => this.callApi('list', ...args)

  remove = (...args) => this.callApi('delete', ...args)


  getVideosFromIds = async (ids, accessToken) => {
      const { items } = await this.list('videos', {
        access_token: accessToken,
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

  getPlaylists = async (accessToken, pageToken = '') => {
      const { items, nextPageToken, pageInfo } = await this.list('playlists', {
        access_token: accessToken,
        pageToken,
        part: 'snippet, contentDetails, status',
        mine: true,
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

  getPlaylistTitle = async (accessToken, id) => {
    const { items } = await this.list('playlists', {
      id,
      access_token: accessToken,
      part: 'snippet'
    })

    const { title } = items[0].snippet

    return title
  }

  getPlaylistItems = async (accessToken, playlistId, pageToken = '') => {
      const { items, nextPageToken, pageInfo } = await this.list('playlistItems', {
        access_token: accessToken,
        playlistId,
        pageToken,
        part: 'snippet, status',
        maxResults: ITEMS_PER_REQUEST
      })

      const videoIds = items.map(({ snippet }) => snippet.resourceId.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      }
  }

  searchVideos = async(accessToken, query, pageToken, channelId) => {
      const { items, nextPageToken, pageInfo } = await this.list('search', {
        access_token: accessToken,
        part: 'snippet',
        type: 'video',
        q: query,
        pageToken,
        maxResults: ITEMS_PER_REQUEST,
      })

      const videoIds = items.map(({ id }) => id.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      }
  }

  getVideo = async (accessToken, urlOrId) => {
      const { items } = await this.list('videos', {
        access_token: accessToken,
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

  getSubscriptions = async (accessToken, pageToken = '') => {
      const { items, nextPageToken, pageInfo } = await this.list('subscriptions', {
        access_token: accessToken,
        pageToken,
        part: 'id, snippet, contentDetails',
        mine: true,
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

  getChannelTitle = async (accessToken, id) => {
    const { items } = await this.list('channels', {
      id,
      access_token: accessToken,
      part: 'snippet'
    })

    const { title } = items[0].snippet

    return title
  }

  getChannelVideos = async (accessToken, channelId, pageToken) => {
      const { items, nextPageToken, pageInfo } = await this.list('search', {
        access_token: accessToken,
        part: 'snippet',
        type: 'video',
        channelId,
        pageToken,
        maxResults: ITEMS_PER_REQUEST,
      })

      const videoIds = items.map(({ id }) => id.videoId)

      const videos = await this.getVideosFromIds(videoIds, accessToken)

      return {
        items: videos,
        nextPageToken,
        totalResults: pageInfo.totalResults
      }
  }
}

export default new Api()
