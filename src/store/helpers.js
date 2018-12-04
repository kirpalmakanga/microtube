export const createReducer = (initialState, handlers) => (state = {}, action) =>
    handlers.hasOwnProperty(action.type)
        ? handlers[action.type](state, action)
        : { ...initialState, ...state };

export const updateObject = (oldData, newData) => ({ ...oldData, ...newData });
