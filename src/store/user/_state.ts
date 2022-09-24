export interface UserState {
    id: string;
    name: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
    isSignedIn: boolean;
    isSigningIn: boolean;
}

export const initialState = (): UserState => ({
    id: '',
    name: '',
    picture: '',
    accessToken: '',
    refreshToken: '',
    isSignedIn: false,
    isSigningIn: false
});
