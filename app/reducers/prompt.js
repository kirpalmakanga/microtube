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
  'PROMPT_RESET': () => initialState,

  'PROMPT': data => ({ isVisible: true, ...data }),

  'PROMPT_CLOSE': () => ({ isVisible: false })
}

export default (state = initialState, action) => updateState(mutations, state, action)
