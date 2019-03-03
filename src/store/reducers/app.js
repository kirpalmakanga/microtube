import { createReducer } from '../helpers.js';

const initialState = {
    isLoading: false
};

export default createReducer(initialState, {
    'app/SET_LOADER': (state, { data: isLoading }) => ({ ...state, isLoading })
});
