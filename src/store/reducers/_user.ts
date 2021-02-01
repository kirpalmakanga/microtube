import { createReducer, State } from '../helpers';

export interface UserState {
    uid: string,
    name: string,
    picture: string,
    isSignedIn: boolean,
    isSigningIn: boolean
}

export const initialState: UserState = {
    uid: '',
    name: '',
    picture: '',
    isSignedIn: false,
    isSigningIn: false
};

const reducer = createReducer(initialState, {
    'user/UPDATE_DATA': (
        state: State,
        data: State
    ) => ({ ...state, ...data }),

    'user/SIGN_OUT': () => initialState
});

export default reducer;

// export const UserContext = createContext(initialState);

// export const UserContextProvider = ({ children }) => {
//     return <UserContext.Provider>{children}</UserContext.Provider>
// };

// export const UserContextConsumer = UserContext.Consumer;
