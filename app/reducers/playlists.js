// jshint esversion: 6, asi: true
// eslint-env es6
const initialState = {
  items: [],
  pages: [],
  isLoading: 0,
  totalResults: 0
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'GET_PLAYLISTS':
      return Object.assign({}, state, { isLoading: 1 })

    case 'GET_PLAYLISTS_SUCCESS':
      let { items, nextPageToken, totalResults } = action.data
      let isNewToken = typeof nextPageToken === 'string' && !state.pages.includes(nextPageToken)
      let endOfContent = typeof nextPageToken === 'undefined'

      if (isNewToken) {
        return Object.assign({}, state, {
          items: [...state.items, ...items],
          pages: [...state.pages, nextPageToken],
          isLoading: 0,
          totalResults
        })
      } else if (endOfContent) {
        return Object.assign({} , state, {
          items: [...state.items, ...items],
          isLoading: 2
        })
      }

    case 'UNLINK_SUCCESS':
      return initialState
  }

  return state
}
