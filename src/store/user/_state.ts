export interface UserState {
    uid: string;
    name: string;
    picture: string;
    isSignedIn: boolean;
    isSigningIn: boolean;
}

export const initialState = (): UserState => ({
    uid: '',
    name: '',
    picture: '',
    isSignedIn: false,
    isSigningIn: false
});
