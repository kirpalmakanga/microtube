import { getPlaylistItems, searchVideos, getVideo } from '../api/youtube'

// export function getPlaylists (accessToken, pageToken) {
//   return async (dispatch) => {
//     try {
//       const data = await api.getPlaylists(accessToken, pageToken)
//       dispatch({ type: 'GET_PLAYLISTS', data })
//     } catch (err) {
//       dispatch({ type: 'NOTIFY', data: 'Error fetching playlists.' })
//     }
//   }
// }

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

// export function getPlaylistItems (accessToken, playlistId, pageToken) {
//   return async (dispatch) => {
//     try {
//       const data = await api.getPlaylistItems(accessToken, playlistId, pageToken)
//
//       dispatch({ type: 'GET_PLAYLIST', data })
//     } catch (err) {
//       dispatch({ type: 'NOTIFY', data: 'Error fetching playlist items.' })
//     }
//   }
// }

export function queuePlaylist ({ playlistId, play }) {
  return (dispatch) => {
    const getItems = async (pageToken) => {
      try {
        const { items, nextPageToken } = await getPlaylistItems({ playlistId, pageToken })

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

export function searchContent (query, pageToken) {
  return async (dispatch, getState) => {
    const { search } = getState()

    if(query === search.query) {
        return
    }

    dispatch({ type: 'SEARCH_VIDEOS', data: { query } })

    try {
        const data = await searchVideos({ query, pageToken })

        dispatch({ type: 'SEARCH_VIDEOS_SUCCESS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error searching videos.' })
    }
  }
}

export function queueVideo (urlOrId) {
  return async (dispatch) => {
    try {
      const data = await getVideo(urlOrId)

      dispatch({ type: 'QUEUE_PUSH', data: [data] })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching video.' })
    }
  }
}

// export function getSubscriptions (pageToken) {
//   return async (dispatch) => {
//     dispatch({ type: 'GET_SUBSCRIPTIONS' })
//     try {
//       const data = await api.getSubscriptions(pageToken)
//
//       dispatch({ type: 'GET_SUBSCRIPTIONS_SUCCESS', data })
//     } catch (err) {
//       dispatch({ type: 'NOTIFY', data: 'Error fetching subscriptions.' })
//     }
//   }
// }

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

export function getChannelVideos ({ channelId, pageToken }) {
  return async (dispatch) => {
    dispatch({ type: 'GET_CHANNEL_VIDEOS' })
    try {
      const data = await api.getChannelVideos({ channelId, pageToken })

      dispatch({ type: 'GET_CHANNEL_VIDEOS_SUCCESS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching channel videos.' })
    }
  }
}
