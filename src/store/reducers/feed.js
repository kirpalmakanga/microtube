const initialState = {
    items: []
}

export default function(state = initialState, { type, data }) {
    switch (type) {
        case 'GET_FEED_VIDEOS':
            state.items = data

            return { ...state }

        case 'CLEAR_FEED':
            return initialState
    }
    return state
}
