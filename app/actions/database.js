import api from '../api/database'

import { setActiveQueueItem } from './player.js'

exports.getPlaylists = (accessToken, pageId) => {
  return dispatch => {
    dispatch({ type: 'GET_PLAYLISTS' })
    api.getPlaylists(accessToken, pageId)
    .then(data => dispatch({ type: 'GET_PLAYLISTS_SUCCESS', data }))
    .catch(err => dispatch({ type: 'NOTIFY', data: err }))
  }
}

exports.getAllPlaylists = (accessToken) => {
  return dispatch => {
    dispatch({ type: 'GET_PLAYLISTS' })
    const getItems = nextPage => {
      api.getPlaylists(accessToken, nextPage)
      .then(data => {
        const { nextPageToken } = data

        dispatch({ type: 'GET_PLAYLISTS_SUCCESS', data })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({ type: 'NOTIFY', data: err }))
    }
    getItems()
  }
}

exports.queuePlaylist = ({ accessToken, playlistId, queue, play }) => {
  return dispatch => {
    const getItems = nextPage => {
      api.getPlaylistItems(accessToken, playlistId, nextPage)
      .then(data => {
        const { items, nextPageToken } = data

        if (play && !nextPage && items.length > 0) {
          dispatch(setActiveQueueItem({ queue, video: items[0] }))
          items.shift()
        }

        dispatch({ type: 'QUEUE_PUSH', data: items })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({ type: 'NOTIFY', data: err }))
    }

    getItems()
  }
}

exports.getPlaylistItems = (accessToken, playlistId) => {
  return dispatch => {
    const getItems = (nextPage) => {
      api.getPlaylistItems(accessToken, playlistId, nextPage)
      .then(data => {
        const { nextPageToken } = data

        dispatch({ type: 'GET_PLAYLIST_ITEMS_SUCCESS', data })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({ type: 'NOTIFY', data: err }))
    }
    dispatch({ type: 'GET_PLAYLIST_ITEMS' })
    getItems()
  }
}

exports.searchVideos = (accessToken, query, pageToken) => {
  return dispatch => {
    dispatch({ type: 'SEARCH_VIDEOS', data: query })
    api.searchVideos(accessToken, query, pageToken)
    .then(data => {
      dispatch({ type: 'SEARCH_VIDEOS_SUCCESS', data })
    })
    .catch(err => dispatch({ type: 'NOTIFY', data: err }))
  }
}

exports.getVideo = (accessToken, urlOrId) => {
  return dispatch => {
    api.getVideo(accessToken, urlOrId)
    .then(video => {
      dispatch({ type: 'QUEUE_PUSH', data: video })
    })
    .catch(err => dispatch({ type: 'NOTIFY', data: err }))
  }
}

exports.getSubscriptions = (accessToken) => {
  return dispatch => {
    dispatch({ type: 'GET_SUBSCRIPTIONS' })
    const getItems = nextPage => {
      api.getSubscriptions(accessToken, nextPage)
      .then(data => {
        const { nextPageToken } = data

        dispatch({ type: 'GET_SUBSCRIPTIONS_SUCCESS', data })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({ type: 'NOTIFY', data: err }))
    }
    getItems()
  }
}

exports.unsubscribe = (id) => {
  return dispatch => {
    dispatch({ type: 'UNSUBSCRIBE'})

    api.unsubscribe(id)
    .then(data => {
      console.log('unsubscribed', data)
      // dispatch({
      //   type: 'UNSUBSCRIBE_SUCCESS',
      //   data
      // })
    })
    .catch(err => dispatch({ type: 'NOTIFY', data: err }))
  }
}

exports.getChannelVideos = (accessToken, channelId, pageToken) => {
  return dispatch => {
    dispatch({ type: 'GET_CHANNEL_VIDEOS' })

    api.getChannelVideos(accessToken, channelId, pageToken)
    .then(data => {
      dispatch({ type: 'GET_CHANNEL_VIDEOS_SUCCESS', data })
    })
    .catch(err => dispatch({ type: 'NOTIFY', data: err }))
  }
}
