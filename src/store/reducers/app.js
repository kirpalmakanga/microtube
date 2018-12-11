import { createReducer, updateObject } from '../helpers.js';

const initialState = {
    isLoading: false
};

export default createReducer(initialState, {
    'app/SET_LOADER': (state, { data: isLoading }) =>
        updateObject(state, { isLoading })
});
