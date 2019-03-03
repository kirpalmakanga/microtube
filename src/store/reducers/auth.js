import { createReducer } from '../helpers.js';

const initialState = {
    user: {
        userName: '',
        picture: ''
    },
    isSignedIn: false
};

export default createReducer(initialState, {
    'auth/SIGN_IN': (state, { data }) => ({ ...state, ...data }),

    'auth/SIGN_OUT': () => initialState
});
