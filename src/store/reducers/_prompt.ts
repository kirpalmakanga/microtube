import { State } from '../helpers';

export interface PromptState extends State {
    isVisible: boolean;
    mode: string;
    headerText: string;
    confirmText: string;
    cancelText: string;
    callback: (...args: unknown[]) => void;
}

export const initialState: PromptState = {
    isVisible: false,
    mode: '',
    headerText: '',
    confirmText: '',
    cancelText: '',
    callback: () => {}
};
