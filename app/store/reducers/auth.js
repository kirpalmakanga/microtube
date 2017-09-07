const initialState = {
  token: null,
  refresh: null,
  user: {},
  refreshWatcher: null
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'OAUTH_SUCCESS' :
      return data

    case 'OAUTH_REFRESH':
      const { token } = data
      return { ...state, token }

    case 'UNLINK':
     return initialState
  }
  return state
}
