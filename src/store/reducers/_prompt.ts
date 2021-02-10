import { createReducer, State } from '../helpers';

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

export default createReducer(initialState, {
    'prompt/OPEN': (state: State, payload: State) => ({
        ...state,
        ...payload,
        isVisible: true
    }),
    'prompt/CLOSE': (state: State) => ({
        ...state,
        isVisible: false
    }),
    'prompt/RESET': (state: State) => ({
        ...initialState
    })
});
