const initialState = {
  token: null,
  refresh: null,
  user: {},
  refreshWatcher: null
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'OAUTH_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        user: action.user,
        refreshWatcher: action.refreshWatcher
      })

    case 'OAUTH_REFRESH':
      return Object.assign({}, state, { token: action.token })

    case 'UNLINK':
      return initialState

    default:
      return state
  }
}
