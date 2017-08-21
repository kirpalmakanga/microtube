const initialState = {
  playlistTitle: '',
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

// const actions = {
//   'PLAYLIST_OPEN': playlistTitle => ({ playlistTitle }),
//
//   'GET_PLAYLIST_ITEMS': () => ({ isLoading: 1 }),
//
//   'GET_PLAYLIST_ITEMS_SUCCESS': ({ items, nextPageToken, totalResults }, state) => {
//     let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
//     let endOfContent = typeof nextPageToken === 'undefined'
//
//     // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')
//
//     if (isNewToken) {
//       return {
//         items: [...state.items, ...items],
//         pages: [...state.pages, nextPageToken],
//         isLoading: typeof nextPageToken === 'undefined' ? 2 : 0,
//         totalResults
//       }
//     } else if (endOfContent && state.isLoading !== 2) {
//       return {
//         items: [...state.items, ...items],
//         isLoading: 2
//       }
//     } else {
//       return state
//     }
//   },
//
//   'PLAYLIST_CLOSE': () => initialState,
//   'CLEAR_PLAYLIST_ITEMS': () => initialState,
//   'UNLINK_SUCCESS': () => initialState
// }
//
// export default updateState(actions, initialState)

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

      console.log('end of content ?', endOfContent)
      console.log('end of content ?', state.isLoading)

      // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

      if (isNewToken) {
        newData = {
          items: [...state.items, ...items],
          pages: [...state.pages, nextPageToken],
          isLoading: typeof nextPageToken === 'undefined' ? 2 : 0,
          totalResults
        }
      } else if (endOfContent && state.isLoading !== 2) {
        console.log('hey')
        newData = {
          items: [...state.items, ...items],
          isLoading: 2
        }
      }

      console.log('new data', newData)

      return { ...state, ...newData }

    case 'PLAYLIST_CLOSE':
    case 'CLEAR_PLAYLIST_ITEMS':
    case 'UNLINK_SUCCESS':
      return initialState
  }
  return state
}
