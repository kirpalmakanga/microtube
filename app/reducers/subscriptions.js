import updateState from '../lib/updateState'

const initialState = {
  items: [],
  pages: [],
  isLoading: 0
}

const mutations = {
  'GET_SUBSCRIPTIONS': state => Object.assign({}, state, { isLoading: 1 }),

  'GET_SUBSCRIPTIONS_SUCCESS': (state, { items, nextPageToken, totalResults }) => {
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
  
  'UNSUBSCRIBE': (state, key) => Object.assign({}, state, { items: state.items.filter(({ id }) => id !== key) }),

  'UNLINK_SUCCESS': () => initialState
}

export default (state = initialState, action) => {
  console.log(action.type, action.data)
  return updateState(mutations, state, action)
}
