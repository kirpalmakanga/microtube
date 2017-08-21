const initialState = {
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

export default function (state = initialState, { type, data }) {
  console.log(type, data)
  switch (type) {
    case 'GET_CHANNEL_VIDEOS':
      return { ...state, isLoading: 1 }

    case 'GET_CHANNEL_VIDEOS_SUCCESS':
      const { items, nextPageToken, totalResults } = data
      const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      const endOfContent = typeof nextPageToken === 'undefined'

      let newData

      if (isNewToken) {
        newData = {
          items: [...state.items, ...items],
          pages: [...state.pages, nextPageToken],
          isLoading: 0,
          totalResults
        }
      } else if (endOfContent && state.isLoading !== 2) {
        newData = {
          items: [...state.items, ...items],
          isLoading: 2
        }
      }

      return { ...state, ...newData }

    case 'CLEAR_CHANNEL_VIDEOS':
    case 'UNLINK_SUCCESS':
      return initialState
  }
  return state
}


// export default updateState(actions, initialState)
