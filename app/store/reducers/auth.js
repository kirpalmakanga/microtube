const initialState = {
  user: {},
  token: null,
  isSignedIn: false
}

export default function (state = initialState, { type, data }) {
  switch (type) {
    case 'SIGN_IN':
      const { isSignedIn, token, user } = data

      return { ... state, user, token, isSignedIn }

    case 'SIGN_OUT':
      return initialState
  }
  return state
}
