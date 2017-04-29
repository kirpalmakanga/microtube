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
  'SEARCH_OPEN': () => ({ isOpen: true }),

  'SEARCH_VIDEOS': (newQuery, { query }) => {
    const isNewQuery = newQuery !== query

    return {
      items: isNewQuery ? [] : state.items,
      pages: isNewQuery ? [] : state.pages,
      isLoading: 1,
      query: newQuery
    }
  },

  'SEARCH_VIDEOS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
    let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    let endOfContent = typeof nextPageToken === 'undefined'

    console.log('totalResults', totalResults)

    // if (isNewToken) {
    return {
      items: [...state.items, ...items],
      pages: [...state.pages, nextPageToken],
      isLoading: 0,
      totalResults
    }
    // } else if (endOfContent) {
    //   return Object.assign({} , state, { isLoading: 2 })
    // }
  },

  'SEARCH_CLOSE': () => initialState
}

export default updateState(actions, initialState)
