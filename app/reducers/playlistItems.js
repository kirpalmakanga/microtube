import updateState from '../lib/updateState'

const initialState = {
  playlistTitle: '',
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

const mutations = {
  'PLAYLIST_OPEN': (state, playlistTitle) => Object.assign({}, state, { playlistTitle }),

  'GET_PLAYLIST_ITEMS': state => Object.assign({}, state, { isLoading: 1 }),

  'GET_PLAYLIST_ITEMS_SUCCESS': (state, { items, nextPageToken, totalResults }) => {
    let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
    let endOfContent = typeof nextPageToken === 'undefined'

    // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

    if (isNewToken) {
      return Object.assign({}, state, {
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
  },

  'PLAYLIST_CLOSE': () => initialState,
  'CLEAR_PLAYLIST_ITEMS': () => initialState,
  'UNLINK_SUCCESS': () => initialState
}

export default (state = initialState, action) => updateState(mutations, state, action)
