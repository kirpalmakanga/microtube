import updateState from '../lib/updateState'

const initialState = {
  className: '',
  message: ''
}

const actions = {
  'NOTIFY': data => ({
    className: 'notification--active',
    message: data
  }),

  'CLEAR_NOTIFICATIONS': () => initialState
}

export default updateState(actions, initialState)
