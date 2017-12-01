const initialState = {
  items: [],
  nextPageToken: '',
  totalResults: 0
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'PLAYLIST_OPEN':
      const { playlistTitle } = data
      return { ...state, playlistTitle }

    case 'GET_PLAYLIST_SUCCESS':
      const { items, nextPageToken, totalResults } = data
      // let newItems = items.filter(item => item.status.privacyStatus !== 'private').filter(item => item.snippet.title !== 'Deleted video')

      let newData = {
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        totalResults
      }

      return { ...state, ...newData }

    case 'CLEAR_PLAYLIST_ITEMS':
    case 'SIGN_OUT':
      return initialState
  }
  return state
}
