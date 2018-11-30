import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    message: '',
    isActive: false
};

export default createReducer(initialState, {
    'notifications/OPEN': (state, { data: message }) =>
        updateObject(state, { message, isActive: true }),

    'notifications/CLOSE': (state) =>
        updateObject(state, { isActive: initialState.isActive }),

    'notifications/CLEAR_MESSAGE': (state) =>
        updateObject(state, { message: initialState.message })
});
