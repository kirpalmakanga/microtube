


export default function(state = {}, action) {
  console.log(action.type, action)
  switch (action.type) {
    case 'GET_PLAYLISTS_ERROR':
    case 'QUEUE_PUSH_PLAYLIST_ERROR':
    case 'GET_PLAYLIST_ITEMS_ERROR':
    case 'SEARCH_VIDEOS_ERROR':
    case 'QUEUE_PUSH_ERROR':
    case 'OAUTH_FAILURE':
    case 'LINK_FAILURE':
    case 'UNLINK':
      return {
        className: 'notification--active',
        message: action.notification
      }

    case 'CLEAR_NOTIFICATIONS':
      return {}

    default:
      return state
  }
}
