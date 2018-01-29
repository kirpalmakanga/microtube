export const signIn = (data) => async (dispatch) => {
    dispatch({ type: 'SIGN_IN', data })
}
