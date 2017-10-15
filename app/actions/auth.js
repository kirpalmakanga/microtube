import { getAuthInstance } from '../api/auth'

export function updateSigningStatus () {
  return (dispatch) => {
    const GoogleAuth = getAuthInstance()
    const isSignedIn = GoogleAuth.isSignedIn.get()

    console.log('status', isSignedIn)

    if(isSignedIn) {
      let { currentUser } = GoogleAuth
      let { Zi, w3 } = currentUser.get()

      dispatch({
        type: 'SIGN_IN',
        data: {
          isSignedIn,
          token: Zi.access_token,
          user: {
            picture: w3.Paa,
            userName: w3.ig || w3.ofa
          }
        }
      })
    } else {
      dispatch({ type: 'SIGN_OUT' })
    }
  }
}
