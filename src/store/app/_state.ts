export interface AppState {
    isLoading: boolean;
}

export const initialState = (): AppState => ({
    isLoading: false
});
