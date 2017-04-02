import updateState from '../lib/updateState'

const initialState = {
  token: null,
  refresh: null,
  user: {},
  refreshWatcher: null
}

const mutations = {
    'OAUTH_SUCCESS' : (state, data) => Object.assign({}, state, data),

    'OAUTH_REFRESH': (state, token) => Object.assign({}, state, { token }),

    'UNLINK': () => initialState
}

export default (state = initialState, action) => updateState(mutations, state, action)
