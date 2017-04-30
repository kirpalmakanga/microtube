import updateState from '../lib/updateState'

const initialState = {
  items: [],
  pages: [],
  isLoading: 0
}

const actions = {
  'GET_CHANNEL_VIDEOS': () => ({ isLoading: 1 }),

  'GET_CHANNEL_VIDEOS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
    const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    const endOfContent = typeof nextPageToken === 'undefined'

    if (isNewToken) {
      return {
        items: [...state.items, ...items],
        pages: [...state.pages, nextPageToken],
        isLoading: 0,
        totalResults
      }
    } else if (endOfContent && state.isLoading !== 2) {
      return {
        items: [...state.items, ...items],
        isLoading: 2
      }
    } else {
      return state
    }
  },

  'CLEAR_CHANNEL_VIDEOS': () => initialState,

  'UNLINK_SUCCESS': () => initialState
}

export default updateState(actions, initialState)
