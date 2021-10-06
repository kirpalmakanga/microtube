import { createReducer, State } from '../helpers';

export interface UserState {
    uid: string;
    name: string;
    picture: string;
    isSignedIn: boolean;
    isSigningIn: boolean;
}

export const initialState: UserState = {
    uid: '',
    name: '',
    picture: '',
    isSignedIn: false,
    isSigningIn: false
};

const reducer = createReducer(initialState, {
    'user/UPDATE_DATA': (state: State, data: State) => ({ ...state, ...data }),

    'user/SIGN_OUT': () => ({ initialState })
});

export default reducer;
