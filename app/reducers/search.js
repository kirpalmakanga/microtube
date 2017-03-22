const initialState = {
  isOpen: false,
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0,
  query: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_OPEN':
      return Object.assign({}, state, { isOpen: true })

    case 'SEARCH_CLOSE':
      return Object.assign({}, state, initialState)

    case 'SEARCH_VIDEOS':
      let newQuery = state.query !== action.query
      return Object.assign({}, state, {
        items: newQuery ? [] : state.items,
        pages: newQuery ? [] : state.pages,
        isLoading: 1,
        query: action.query
      })

    case 'SEARCH_VIDEOS_SUCCESS':
      let { items, nextPageToken, totalResults } = action.data
      let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      let endOfContent = typeof nextPageToken === 'undefined'

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

    case 'CLEAR_SEARCH':
      return initialState
  }

  return state
}
