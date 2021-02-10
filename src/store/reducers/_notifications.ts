import { createReducer, State } from '../helpers';

export interface NotificationState extends State {
    message: string;
    isVisible: boolean;
}

export const initialState: NotificationState = {
    message: '',
    isVisible: false
};

export default createReducer(initialState, {
    'notifications/OPEN': (state: State, { message }: State) => ({
        ...state,
        message,
        isVisible: true
    }),

    'notifications/CLOSE': (state: State) => ({
        ...state,
        isVisible: initialState.isVisible
    }),

    'notifications/CLEAR_MESSAGE': (state: State) => ({
        ...state,
        message: initialState.message
    })
});
