import { State } from '../helpers';

export interface NotificationState extends State {
    message: string;
    isVisible: boolean;
}

export const initialState: NotificationState = {
    message: '',
    isVisible: false
};
