// jshint esversion: 6, asi: true
// eslint-env es6

export default function(state = {}, action) {
  console.log(action.type, action)
  switch (action.type) {
    case 'GET_PLAYLISTS_ERROR':
      return {
        className: 'notification--active',
        message: action.notifications.error
      }

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
