const initialState = {
  items: [],
  nextPageToken: ''
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'GET_SUBSCRIPTIONS':
      const { items, nextPageToken, totalResults } = data

      let newData = {
        items: [...state.items, ...items],
        nextPageToken: nextPageToken || null,
        totalResults
      }

      return { ...state, ...newData }

    case 'CLEAR_SUBSCRIPTIONS':
    case 'SIGN_OUT':
      return initialState
  }
  return state
}
