import updateState from '../lib/updateState'

const initialState = {
  className: '',
  message: ''
}

const actions = {
  'NOTIFY': data => ({
    className: 'notification--active',
    message: action.notification
  }),

  'CLEAR_NOTIFICATIONS': () => initialState
}

export default updateState(actions, initialState)
