import updateState from '../lib/updateState'

const initialState = {
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

const mutations = {
  'GET_PLAYLISTS': () => ({ isLoading: 1 }),

  'GET_PLAYLISTS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
    const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    const endOfContent = typeof nextPageToken === 'undefined'

    if (isNewToken) {
      return {
        items: [...state.items, ...items],
        pages: [...state.pages, nextPageToken],
        isLoading: 0,
        totalResults
      }
    } else if (endOfContent) {
      return {
        items: [...state.items, ...items],
        isLoading: 2
      }
    }
  },

  'UNLINK_SUCCESS': () => initialState
}

export default (state = initialState, action) => updateState(mutations, state, action)
