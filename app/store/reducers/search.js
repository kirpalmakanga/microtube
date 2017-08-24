const initialState = {
  isOpen: false,
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0,
  query: ''
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'SEARCH_OPEN':
      return { ... state, isOpen: true }

    case 'SEARCH_VIDEOS':
      const { query } = data
      const isNewQuery = query !== state.query

      return {
        ...state,
        items: isNewQuery ? [] : state.items,
        pages: isNewQuery ? [] : state.pages,
        isLoading: 1,
        query
      }

    case 'SEARCH_VIDEOS_SUCCESS':
      const { items, nextPageToken, totalResults } = data
      const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      const endOfContent = typeof nextPageToken === 'undefined'

      let newData
      // if (isNewToken) {
      newData = {
        items: [...state.items, ...items],
        pages: [...state.pages, nextPageToken],
        isLoading: 0,
        totalResults
      }
      // } else if (endOfContent) {
      //   return Object.assign({} , state, { isLoading: 2 })
      // }

      return { ...state, ...newData }

    case 'SEARCH_CLOSE':
      return initialState
  }
  return state
}
