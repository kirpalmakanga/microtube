import updateState from '../lib/updateState'

const initialState = {
  form: false,
  isVisible: false,
  promptText: '',
  confirmText: '',
  cancelText: 'Annuler',
  callback: () => {}
}

const actions = {
  'PROMPT_RESET': () => initialState,

  'PROMPT': data => ({ isVisible: true, ...data }),

  'PROMPT_CLOSE': () => ({ isVisible: false })
}

export default updateState(actions, initialState)
