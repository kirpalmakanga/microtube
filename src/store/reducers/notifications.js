const initialState = {
  message: ''
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'NOTIFY':
      return { ...state, message: data }

    case 'CLEAR_NOTIFICATIONS':
      return initialState
  }
  return state
}
