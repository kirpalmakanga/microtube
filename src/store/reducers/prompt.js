const initialState = {
  form: false,
  isVisible: false,
  promptText: '',
  confirmText: '',
  cancelText: 'Annuler',
  callback: () => {}
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'PROMPT_RESET':
      return initialState

    case 'PROMPT':
      return {
        ...state,
        isVisible: true,
        ...data
      }

    case 'PROMPT_CLOSE':
      return { ...state, isVisible: false }
  }
  return state
}
