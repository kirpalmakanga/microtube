import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    message: ''
};

export default createReducer(initialState, {
    NOTIFY: (state, message) => updateObject(state, { message }),

    CLEAR_NOTIFICATIONS: () => initialState
});
