import { createReducer } from '../helpers';

const initialState = {
    form: false,
    isVisible: false,
    promptText: '',
    confirmText: '',
    cancelText: 'Cancel',
    callback: () => {}
};

export default createReducer(initialState, {
    'prompt/RESET': () => initialState,

    'prompt/OPEN': (state, data) => ({
        ...state,
        ...data,
        isVisible: true
    }),

    'prompt/CLOSE': (state) => ({ ...state, isVisible: false })
});
