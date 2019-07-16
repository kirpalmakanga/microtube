import { createReducer } from '../helpers.js';

const initialState = {
    user: {
        id: '',
        name: '',
        picture: ''
    },
    isSignedIn: false
};

export default createReducer(initialState, {
    'auth/UPDATE_DATA': (
        { user: currentUser, ...state },
        { data: { user = {}, ...data } }
    ) => ({ ...state, ...data, user: { ...currentUser, ...user } }),

    'auth/SIGN_OUT': () => initialState
});
