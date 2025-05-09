export interface UserState {
    id: string;
    name: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    isSignedIn: boolean;
}

export const initialState = (): UserState => ({
    id: '',
    name: '',
    picture: '',
    accessToken: '',
    refreshToken: '',
    idToken: '',
    isSignedIn: false
});
