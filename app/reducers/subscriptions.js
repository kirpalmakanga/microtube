import updateState from '../lib/updateState'

const initialState = {
  items: [],
  pages: [],
  isLoading: 0
}

const actions = {
  'GET_SUBSCRIPTIONS': () => ({ isLoading: 1 }),

  'GET_SUBSCRIPTIONS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
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

  'UNSUBSCRIBE': (key, { items }) => ({ items: items.filter(({ id }) => id !== key) }),

  'CLEAR_SUBSCRIPTIONS': () => initialState,

  'UNLINK_SUCCESS': () => initialState
}

export default updateState(actions, initialState)
