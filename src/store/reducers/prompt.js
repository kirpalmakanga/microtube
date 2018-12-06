import { createReducer, updateObject } from '../helpers.js';

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

    'prompt/OPEN': (state, { data }) =>
        updateObject(state, {
            ...data,
            isVisible: true
        }),

    'prompt/CLOSE': (state) => updateObject(state, { isVisible: false })
});
