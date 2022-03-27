export interface UserState {
    id: string;
    name: string;
    picture: string;
    isSignedIn: boolean;
    isSigningIn: boolean;
}

export const initialState = (): UserState => ({
    id: '',
    name: '',
    picture: '',
    isSignedIn: false,
    isSigningIn: false
});
