import updateState from '../lib/updateState'

const initialState = {
  isOpen: false,
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0,
  query: ''
}

const actions = {
  'SEARCH_OPEN': state => Object.assign({}, state, { isOpen: true }),

  'SEARCH_VIDEOS': (state, query) => {
    let newQuery = state.query !== query
    return Object.assign({}, state, {
      items: newQuery ? [] : state.items,
      pages: newQuery ? [] : state.pages,
      isLoading: 1,
      query
    })
  },

  'SEARCH_VIDEOS_SUCCESS': (state, { items, nextPageToken, totalResults }) => {
    let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    let endOfContent = typeof nextPageToken === 'undefined'

    console.log('totalResults', totalResults)

    // if (isNewToken) {
    return Object.assign({}, state, {
      items: [...state.items, ...items],
      pages: [...state.pages, nextPageToken],
      isLoading: 0,
      totalResults
    })
    // } else if (endOfContent) {
    //   return Object.assign({} , state, { isLoading: 2 })
    // }
  },

  'SEARCH_CLOSE': () => initialState
}

export default (state = initialState, action) => updateState(actions, state, action)
