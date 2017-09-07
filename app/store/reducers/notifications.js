const initialState = {
  className: '',
  message: ''
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'NOTIFY':
      return {
        ...state,
        className: 'notification--active',
        message: data
      }

    case 'CLEAR_NOTIFICATIONS':
      return initialState
  }
  return state
}
