


const initialState = {
  token: null,
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
        user: action.user
      })
    case 'UNLINK':
      return initialState
    default:
      return state
  }
}
