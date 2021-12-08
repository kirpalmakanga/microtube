export interface NotificationState {
    isVisible: boolean;
    message: string;
    callback: Function | null;
    callbackButtonText: string;
}

export const initialState = (): NotificationState => ({
    isVisible: false,
    message: '',
    callback: null,
    callbackButtonText: 'OK'
});
