const initialState = {
  playlistTitle: '',
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'PLAYLIST_OPEN':
      const { playlistTitle } = data
      return { ...state, playlistTitle }

    case 'GET_PLAYLIST_ITEMS':
      return { ...state, isLoading: 1 }

    case 'GET_PLAYLIST_ITEMS_SUCCESS':
      const { items, nextPageToken, totalResults } = data
      const isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      const endOfContent = typeof nextPageToken === 'undefined'

      let newData

      // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

      if (isNewToken) {
        newData = {
          items: [...state.items, ...items],
          pages: [...state.pages, nextPageToken],
          isLoading: typeof nextPageToken === 'undefined' ? 2 : 0,
          totalResults
        }
      } else if (endOfContent && state.isLoading !== 2) {
        newData = {
          items: [...state.items, ...items],
          isLoading: 2
        }
      }

      return { ...state, ...newData }

    case 'PLAYLIST_CLOSE':
    case 'CLEAR_PLAYLIST_ITEMS':
    case 'UNLINK_SUCCESS':
      return initialState
  }
  return state
}
