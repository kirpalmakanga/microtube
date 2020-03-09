export const createReducer = (initialState, handlers) => (
    state = {},
    { type, data = {} } = {}
) => {
    const handler = handlers[type];

    if (typeof handler === 'function') {
        return handler(state, data);
    }

    return { ...initialState, ...state };
};
