const initialState = {
    items: [],
    nextPageToken: '',
    query: ''
}

export default function(state = initialState, { type, data }) {
    switch (type) {
        case 'SEARCH_VIDEOS':
            const { query } = data

            state = query !== state.query ? initialState : state

            return { ...state, query }

        case 'SEARCH_VIDEOS_SUCCESS':
            const { items, nextPageToken, totalResults } = data

            let newData = {
                items: [...state.items, ...items],
                nextPageToken: nextPageToken || null,
                totalResults
            }

            return { ...state, ...newData }

        case 'CLEAR_SEARCH':
            return initialState
    }
    return state
}
