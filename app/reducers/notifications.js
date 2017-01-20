// jshint esversion: 6, asi: true
// eslint-env es6

export default function(state = {}, action) {
  console.log(action.type, action)
  switch (action.type) {
    case 'GET_PLAYLISTS_ERROR':
      return {
        className: 'mdl-snackbar--active',
        message: action.notifications.error
      }

    case 'OAUTH_FAILURE':
      return {
        className: 'mdl-snackbar--active',
        message: action.notification
      }

    case 'LINK_FAILURE':
      return {
        className: 'mdl-snackbar--active',
        message: action.notification
      }

    case 'UNLINK_SUCCESS':
    case 'UNLINK_FAILURE':
      return {
        className: 'mdl-snackbar--active',
        message: action.notification
      }

    case 'CLEAR_NOTIFICATIONS':
      return {}

    default:
      return state
  }
}
