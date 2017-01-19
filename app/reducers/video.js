// jshint esversion: 6, asi: true
// eslint-env es6
let initialState = {
  snippet: {
    title: '',
    description: '',
    resourceId: {
      videoId: ''
    }
  }
}

export default function(state = initialState, action) {
  switch (action.type) {

    case 'GET_VIDEO_SUCCESS':
      return Object.assign({}, state, action.data.items[0], {
        id: action.data.items[0].id
      })
    case 'LOAD_VIDEO':
      return Object.assign({}, state, action.data)
  }

  return state
}
