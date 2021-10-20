export interface PromptState {
    isVisible: boolean;
    mode: string;
    headerText: string;
    confirmText: string;
    cancelText: string;
    callback: (...args: unknown[]) => void;
}

export const initialState: PromptState = {
    isVisible: false,
    mode: 'default',
    headerText: '',
    confirmText: '',
    cancelText: '',
    callback: () => {}
};
