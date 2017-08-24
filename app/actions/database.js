// import api from '../api/database'
import api from '../api/youtube'

import { setActiveQueueItem } from './player.js'


export function getPlaylists (accessToken, pageToken) {
  return async (dispatch) => {
    dispatch({ type: 'GET_PLAYLISTS' })

    try {
      const data = await api.getPlaylists(accessToken, pageToken)
      dispatch({ type: 'GET_PLAYLISTS_SUCCESS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching playlists.' })
    }
  }
}

// export function getAllPlaylists (accessToken) {
//   return (dispatch) => {
//     const getItems = async (nextPage) => {
//       try {
//           const data = await api.getPlaylists(accessToken, nextPage)
//           const { nextPageToken } = data
//
//           dispatch({ type: 'GET_PLAYLISTS_SUCCESS', data })
//
//           if (nextPageToken) {
//             getItems(nextPageToken)
//           }
//       } catch (err) {
//         dispatch({ type: 'NOTIFY', data: err })
//       }
//     }
//     dispatch({ type: 'GET_PLAYLISTS' })
//     getItems()
//   }
// }

export function getPlaylistItems (accessToken, playlistId, pageToken) {
  return async (dispatch) => {
    dispatch({ type: 'GET_PLAYLIST_ITEMS' })
    try {
      const data = await api.getPlaylistItems(accessToken, playlistId, pageToken)

      dispatch({ type: 'GET_PLAYLIST_ITEMS_SUCCESS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching playlist items.' })
    }
  }
}

// export function getAllPlaylistItems (accessToken, playlistId) {
//   return (dispatch) => {
//     const getItems = async (pageToken) => {
//       try {
//         const data = await api.getPlaylistItems(accessToken, playlistId, pageToken)
//         const { nextPageToken } = data
//
//         dispatch({ type: 'GET_PLAYLIST_ITEMS_SUCCESS', data })
//
//         if (nextPageToken) {
//           getItems(nextPageToken)
//         }
//       } catch (err) {
//         dispatch({ type: 'NOTIFY', data: err })
//       }
//     }
//
//     dispatch({ type: 'GET_PLAYLIST_ITEMS' })
//     getItems()
//   }
// }

export function queuePlaylist ({ accessToken, playlistId, queue, play }) {
  return (dispatch) => {
    const getItems = async (pageToken) => {
      try {
        const { items, nextPageToken } = await api.getPlaylistItems(accessToken, playlistId, pageToken)

        if (play && !pageToken && items.length > 0) {
          dispatch(setActiveQueueItem({ queue, video: items[0] }))
          items.shift()
        }

        dispatch({ type: 'QUEUE_PUSH', data: items })

        if (nextPageToken) {
          getItems(nextPageToken)
        }
      } catch (err) {
        dispatch({ type: 'NOTIFY', data: 'Error fetching playlist items.' })
      }
    }

    getItems()
  }
}

export function searchVideos (accessToken, query, pageToken) {
  return async (dispatch) => {
    dispatch({ type: 'SEARCH_VIDEOS', data: { query } })

    try {
        const data = await api.searchVideos(accessToken, query, pageToken)

        dispatch({ type: 'SEARCH_VIDEOS_SUCCESS', data })
    } catch (err) {
      console.error(err)
      dispatch({ type: 'NOTIFY', data: 'Error searching videos.' })
    }
  }
}

export function getVideo (accessToken, urlOrId) {
  return async (dispatch) => {
    try {
      const data = await api.getVideo(accessToken, urlOrId)

      dispatch({ type: 'QUEUE_PUSH', data: [data] })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching video.' })
    }
  }
}

export function getSubscriptions (accessToken, pageToken) {
  return async (dispatch) => {
    dispatch({ type: 'GET_SUBSCRIPTIONS' })
    try {
      const data = await api.getSubscriptions(accessToken, pageToken)

      dispatch({ type: 'GET_SUBSCRIPTIONS_SUCCESS', data })
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

export function getChannelVideos (accessToken, channelId, pageToken) {
  return async (dispatch) => {
    dispatch({ type: 'GET_CHANNEL_VIDEOS' })
    try {
        const data = await api.getChannelVideos(accessToken, channelId, pageToken)

        dispatch({ type: 'GET_CHANNEL_VIDEOS_SUCCESS', data })
    } catch (err) {
      dispatch({ type: 'NOTIFY', data: 'Error fetching channel videos.' })
    }
  }
}
