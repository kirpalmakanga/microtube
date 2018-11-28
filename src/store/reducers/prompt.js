import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    form: false,
    isVisible: false,
    promptText: '',
    confirmText: '',
    cancelText: 'Annuler',
    callback: () => {}
};

export default createReducer(initialState, {
    PROMPT_RESET: () => initialState,

    PROMPT: (state, { data }) =>
        updateObject(state, {
            ...data,
            isVisible: true
        }),

    PROMPT_CLOSE: (state) => updateObject(state, { ...state, isVisible: false })
});
