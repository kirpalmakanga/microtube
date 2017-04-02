import updateState from '../lib/updateState'

const initialState = {
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

const mutations = {
  'GET_PLAYLISTS': state => Object.assign({}, state, { isLoading: 1 }),

  'GET_PLAYLISTS_SUCCESS': (state, { items, nextPageToken, totalResults }) => {
    const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    const endOfContent = typeof nextPageToken === 'undefined'

    if (isNewToken) {
      return Object.assign({}, state, {
        items: [...state.items, ...items],
        pages: [...state.pages, nextPageToken],
        isLoading: 0,
        totalResults
      })
    } else if (endOfContent) {
      return Object.assign({} , state, {
        items: [...state.items, ...items],
        isLoading: 2
      })
    }
  },

  'UNLINK_SUCCESS': () => initialState
}

export default (state = initialState, action) => updateState(mutations, state, action)
