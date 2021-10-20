export interface NotificationState {
    message: string;
    isVisible: boolean;
}

export const initialState: NotificationState = {
    message: '',
    isVisible: false
};
