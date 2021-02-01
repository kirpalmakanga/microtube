import { createReducer } from '../helpers';

export const initialState = {
    message: '',
    isActive: false
};

export default createReducer(initialState, {
    'notifications/OPEN': (state, { message }) => ({
        ...state,
        message,
        isActive: true
    }),

    'notifications/CLOSE': (state) => ({
        ...state,
        isActive: initialState.isActive
    }),

    'notifications/CLEAR_MESSAGE': (state) => ({
        ...state,
        message: initialState.message
    })
});
