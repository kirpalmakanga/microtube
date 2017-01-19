// jshint esversion: 6, asi: true
// eslint-env es6

const initialState = {
  isVisible: false,
  promptText: '',
  confirmText: '',
  cancelText: '',
  callback: () => {}
}

export default function(state = initialState, action) {
  switch (action.type) {
    case 'PROMPT_DELETE_PLAYLIST':
      return Object.assign({}, state, {
        isVisible: true,
        promptText: 'Supprimer la playlist ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        callback: action.callback
      })

    case 'PROMPT_DELETE_PLAYLIST_ITEM':
      return Object.assign({}, state, {
        isVisible: true,
        promptText: 'Supprimer ' + action.title + ' de la playlist ?',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
        callback: action.callback
      })

    case 'PROMPT_UNLINK_ACCOUNT':
      return Object.assign({}, state, {
        isVisible: true,
        promptText: 'Déconnecter le profil ?',
        confirmText: 'Déconnecter',
        cancelText: 'Annuler',
        callback: action.callback
      })

    case 'PROMPT_CLEAR_QUEUE':
      return Object.assign({}, state, {
        isVisible: true,
        promptText: 'Vider la file d\'attente ?',
        confirmText: 'Vider',
        cancelText: 'Annuler',
        callback: action.callback
      })

    case 'PROMPT_CLOSE':
      return initialState
  }

  return state
}
