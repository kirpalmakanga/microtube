const initialState = {
  playlistId: 0,
  playlistTitle: '',
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'PLAYLIST_OPEN':
      return Object.assign({}, state, action.data)

    case 'PLAYLIST_CLOSE':
      return Object.assign({}, state, initialState)

    case 'GET_PLAYLIST_ITEMS':
      return Object.assign({}, state, { isLoading: 1 })

    case 'GET_PLAYLIST_ITEMS_SUCCESS':
      let { items, nextPageToken, totalResults } = action.data
      let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      let endOfContent = typeof nextPageToken === 'undefined'

      // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

      if (isNewToken) {
        return Object.assign({}, state, {
          playlistId: action.playlistId,
          items: [...state.items, ...items],
          pages: [...state.pages, nextPageToken],
          isLoading: typeof nextPageToken === 'undefined' ? 2 : 0,
          totalResults
        })
      } else if (endOfContent) {
        return Object.assign({} , state, {
          items: [...state.items, ...items],
          isLoading: 2
        })
      }

    case 'CLEAR_PLAYLIST_ITEMS':
    case 'UNLINK_SUCCESS':
      return initialState
  }
  return state
}
