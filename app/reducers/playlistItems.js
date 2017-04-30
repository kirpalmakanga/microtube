import updateState from '../lib/updateState'

const initialState = {
  playlistTitle: '',
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

const actions = {
  'PLAYLIST_OPEN': playlistTitle => ({ playlistTitle }),

  'GET_PLAYLIST_ITEMS': () => ({ isLoading: 1 }),

  'GET_PLAYLIST_ITEMS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
    let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    let endOfContent = typeof nextPageToken === 'undefined'

    // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

    if (isNewToken) {
      return {
        items: [...state.items, ...items],
        pages: [...state.pages, nextPageToken],
        isLoading: typeof nextPageToken === 'undefined' ? 2 : 0,
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

  'PLAYLIST_CLOSE': () => initialState,
  'CLEAR_PLAYLIST_ITEMS': () => initialState,
  'UNLINK_SUCCESS': () => initialState
}

export default updateState(actions, initialState)
