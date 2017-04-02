import updateState from '../lib/updateState'

const initialState = {
  form: false,
  isVisible: false,
  promptText: '',
  confirmText: '',
  cancelText: 'Annuler',
  callback: () => {}
}

const mutations = {
  'PROMPT': (state, data) => Object.assign({}, state, { isVisible: true, ...data }),

  'PROMPT_CLOSE': state => Object.assign({}, state, { isVisible: false })
}

export default (state = initialState, action) => updateState(mutations, state, action)
