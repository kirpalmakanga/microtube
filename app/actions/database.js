import api from '../api/database.js'

exports.getPlaylists = (accessToken, pageId) => {
  return dispatch => {
    dispatch({ type: 'GET_PLAYLISTS' })
    api.getPlaylists(accessToken, pageId)
    .then(data => dispatch({
      type: 'GET_PLAYLISTS_SUCCESS',
      data
    }))
    .catch(err => dispatch({
      type: 'GET_PLAYLISTS_ERROR',
      notification: err
    }))
  }
}

exports.getAllPlaylists = (accessToken) => {
  return dispatch => {
    dispatch({ type: 'GET_PLAYLISTS' })
    const getItems = nextPage => {
      api.getPlaylists(accessToken, nextPage)
      .then(data => {
        const { nextPageToken } = data

        dispatch({
          type: 'GET_PLAYLISTS_SUCCESS',
          data
        })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({
        type: 'GET_PLAYLISTS_ERROR',
        notification: err
      }))
    }
    getItems()
  }
}

exports.queuePlaylistItems = (accessToken, playlistId, play) => {
  return dispatch => {
    const getItems = (nextPage) => {
      api.getPlaylistItems(accessToken, playlistId, nextPage)
      .then(data => {
        const { items, nextPageToken } = data

        if (play && !nextPage && items.length > 0) {
          dispatch({
            type: 'PLAY',
            data: items[0],
            skip: true
          })
        }

        dispatch({
          type: 'QUEUE_PUSH_PLAYLIST',
          playlistId,
          data: items
        })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({
        type: 'QUEUE_PUSH_PLAYLIST_ERROR',
        notification: err
      }))
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

        dispatch({
          type: 'GET_PLAYLIST_ITEMS_SUCCESS',
          data
        })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      })
      .catch(err => dispatch({
        type: 'GET_PLAYLIST_ITEMS_ERROR',
        notification: err
      }))
    }
    dispatch({ type: 'GET_PLAYLIST_ITEMS' })
    getItems()
  }
}

exports.searchVideos = (accessToken, query, pageToken) => {
  return dispatch => {
    dispatch({
      type: 'SEARCH_VIDEOS',
      query
    })
    api.searchVideos(accessToken, query, pageToken)
    .then(data => {
      dispatch({
        type: 'SEARCH_VIDEOS_SUCCESS',
        data
      })
    })
    .catch(err => dispatch({
      type: 'SEARCH_VIDEOS_ERROR',
      notification: err
    }))
  }
}

exports.getVideo = (accessToken, urlOrId) => {
  return dispatch => {
    api.getVideo(accessToken, urlOrId)
    .then(video => {
      dispatch({
        type: 'QUEUE_PUSH',
        data: video
      })
    })
    .catch(err => dispatch({
      type: 'QUEUE_PUSH_ERROR',
      notification: err
    }))
  }
}
