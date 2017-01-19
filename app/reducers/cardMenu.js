// jshint esversion: 6, asi: true
// eslint-env es6
const initialState = {
  class: '',
  id: null
}

export default function(state = initialState, action) {
  switch (action.type) {

    case 'OPEN_CARD_MENU':
      return  Object.assign({}, state, {
        class: 'mdl-card__menu-open',
        id: action.id
      })

    case 'CLOSE_CARD_MENU':
      return  Object.assign({}, state, initialState)
  }

  return state
}
