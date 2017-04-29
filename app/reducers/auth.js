import updateState from '../lib/updateState'

const initialState = {
  token: null,
  refresh: null,
  user: {},
  refreshWatcher: null
}

const mutations = {
    'OAUTH_SUCCESS' : data => data,

    'OAUTH_REFRESH': token => ({ token }),

    'UNLINK': () => initialState
}

export default (state = initialState, action) => updateState(mutations, state, action)
