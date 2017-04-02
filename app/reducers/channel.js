import updateState from '../lib/updateState'


const initialState = {
  items: [],
  pages: [],
  isLoading: 0
}

const actions = {
  'GET_CHANNEL_VIDEOS': state => Object.assign({}, state, { isLoading: 1 }),

  'GET_CHANNEL_VIDEOS_SUCCESS': (state, { items, nextPageToken, totalResults }) => {
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

  'CLEAR_CHANNEL_VIDEOS': () => initialState,

  'UNLINK_SUCCESS': () => initialState
}

export default (state = initialState, action) => updateState(actions, state, action)
