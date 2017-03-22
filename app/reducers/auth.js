const initialState = {
  token: null,
  refresh: null,
  user: {}
}

export default function(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, state, { hydrated: true })
  }
  switch (action.type) {
    case 'OAUTH_SUCCESS':
      return Object.assign({}, state, {
        token: action.token,
        refresh: action.refresh,
        user: action.user
      })

    case 'OAUTH_REFRESH':
      return Object.assign({}, state, {
        token: action.token,
        refresh: action.refresh
      })
      
    case 'UNLINK':
      return initialState
    default:
      return state
  }
}
