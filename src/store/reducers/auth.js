import { createReducer } from '../helpers';

const initialState = {
    user: {
        id: '',
        name: '',
        picture: ''
    },
    isSignedIn: false,
    isSigningIn: false
};

export default createReducer(initialState, {
    'auth/UPDATE_DATA': (
        { user: currentUser, ...state },
        { data: { user = {}, ...data } }
    ) => ({ ...state, ...data, user: { ...currentUser, ...user } }),

    'auth/SIGN_OUT': () => initialState
});
