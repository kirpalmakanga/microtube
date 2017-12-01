const initialState = {
  items: [],
  nextPageToken: '',
  totalResults: 0
}

export default function (state = initialState, { type, data }) {
  switch (type) {

    case 'GET_CHANNEL_VIDEOS_SUCCESS':
      const { items, nextPageToken, totalResults } = data

      let newData = {
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        totalResults
      }

      return { ...state, ...newData }

    case 'CLEAR_CHANNEL_VIDEOS':
    case 'SIGN_OUT':
      return initialState
  }
  return state
}


// export default updateState(actions, initialState)
