// jshint esversion: 6, asi: true
// eslint-env es6

const initialState = { class: '' }

export default function(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_MENU':
      return  Object.assign({}, state, { class: 'mdl-layout--drawer-open' })

    case 'CLOSE_MENU':
      return  Object.assign({}, state, initialState)
  }

  return state
}
