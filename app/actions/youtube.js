import * as api from '../api/youtube'

export function getPlaylists (config) {
  return async (dispatch) => {
    try {
      const data = await api.getPlaylists(config)
      dispatch({ type: 'GET_PLAYLISTS', data })
    } catch (err) {
      console.error(err)
      dispatch({ type: 'NOTIFY', data: 'Error fetching playlists.' })
    }
  }
}

// export function getPlaylistTitle (accessToken, playlistId) {
//   return async (dispatch) => {
//     try {
//       const title = await api.getPlaylistTitle(accessToken, [playlistId])
//
//       dispatch({ type: 'SET_PLAYLIST_TITLE', data: { title } })
//     } catch (err) {
//       dispatch({ type: 'NOTIFY', data: 'Error fetching playlist title.' })
//     }
//   }
// }

export function getPlaylistItems (config) {
  return async (dispatch) => {
    try {
      const { playlistId } = config
      const data = await api.getPlaylistItems(config)

      dispatch({ type: 'GET_PLAYLIST', data: { ...data, playlistId } })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching playlist items.' })
    }
  }
}

export function queuePlaylist ({ playlistId, play }) {
  return (dispatch) => {
    const getItems = async (pageToken) => {
      try {
        const { items, nextPageToken } = await api.getPlaylistItems({ playlistId, pageToken })

        if (play && !pageToken && items.length > 0) {
          dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { video: items[0] }
          })
          items.shift()
        }

        dispatch({ type: 'QUEUE_PUSH', data: items })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      } catch (err) {
        console.error(err)
        dispatch({ type: 'NOTIFY', data: 'Error fetching playlist items.' })
      }
    }

    getItems()
  }
}

export function searchVideos (config) {
  return async (dispatch, getState) => {
    try {
        const { query } = config
        const { search } = getState()

        if(query !== search.query) {
            dispatch({ type: 'CLEAR_SEARCH' })
        }

        dispatch({ type: 'SEARCH_VIDEOS', data: { query } })

        const data = await api.searchVideos(config)

        dispatch({ type: 'SEARCH_VIDEOS_SUCCESS', data })
    } catch (err) {
      console.error(err)
      dispatch({ type: 'NOTIFY', data: 'Error searching videos.' })
    }
  }
}

export function queueVideo (urlOrId) {
  return async (dispatch) => {
    try {
      const data = await api.getVideo(urlOrId)

      dispatch({ type: 'QUEUE_PUSH', data: [data] })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching video.' })
    }
  }
}

export function getSubscriptions (config) {
  return async (dispatch) => {
    try {
      const data = await api.getSubscriptions(config)

      dispatch({ type: 'GET_SUBSCRIPTIONS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching subscriptions.' })
    }
  }
}

// export function unsubscribe (id) {
//   return (dispatch) => {
//     dispatch({ type: 'UNSUBSCRIBE'})
//
//     api.unsubscribe(id)
//     .then(data => {
//       console.log('unsubscribed', data)
//       // dispatch({
//       //   type: 'UNSUBSCRIBE_SUCCESS',
//       //   data
//       // })
//     })
//     .catch(err => dispatch({ type: 'NOTIFY', data: err }))
//   }
// }

export function getChannelTitle (channelId) {
  return async (dispatch) => {
    try {
      const title = await api.getChannelTitle(channelId)

      dispatch({ type: 'SET_CHANNEL_TITLE', data: { title } })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching channel title.' })
    }
  }
}

export function getChannelVideos (config) {
  return async (dispatch) => {
    try {
      const data = await api.getChannelVideos(config)

      dispatch({ type: 'GET_CHANNEL_VIDEOS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching channel videos.' })
    }
  }
}
