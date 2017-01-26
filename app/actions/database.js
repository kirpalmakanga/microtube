// jshint esversion: 6, asi: true
// eslint-env es6

import api from '../api/database.js'

export function getPlaylists (accessToken) {
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
      .catch(err => console.error(err))
    }
    getItems()
  }
}

export function queuePlaylistItems (accessToken, playlistId, play) {
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
      .catch(err => console.error(err))
    }

    getItems()
  }
}

export function getPlaylistItems (accessToken, playlistId) {
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
      .catch(err => console.error(err))
    }
    dispatch({ type: 'GET_PLAYLIST_ITEMS' })
    getItems()
  }
}

export function searchVideos (accessToken, query, pageToken) {
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
    .catch(err => console.error(err))
  }
}

export function getVideo (accessToken, urlOrId) {
  return dispatch => {
    api.getVideo(accessToken, urlOrId)
    .then(video => {
      dispatch({
        type: 'QUEUE_PUSH',
        data: video
      })
    })
    .catch(err => console.error(err))
  }
}
