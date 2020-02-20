export const createReducer = (initialState, handlers) => (
    state = {},
    { type, ...action }
) => {
    const handler = handlers[type];

    if (typeof handler === 'function') {
        return handler(state, action);
    }

    return { ...initialState, ...state };
};
