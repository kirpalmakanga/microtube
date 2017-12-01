const initialState = {
  isOpen: false,
  items: [],
  nextPageToken: '',
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
        nextPageToken: isNewQuery ? '' : state.nextPageToken,
        query
      }

    case 'SEARCH_VIDEOS_SUCCESS':
      const { items, nextPageToken, totalResults } = data

      let newData = {
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        totalResults
      }

      return { ...state, ...newData }

    case 'SEARCH_CLOSE':
      return initialState
  }
  return state
}
