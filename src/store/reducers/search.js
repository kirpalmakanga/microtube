const initialState = {
    items: [],
    nextPageToken: '',
    forMine: 0,
    query: ''
}

export default function(state = initialState, { type, data }) {
    console.log(type, data)
    switch (type) {
        case 'SET_SEARCH_MODE':
            const { forMine = 0 } = data

            state.items = []

            return { ...state, forMine }
        case 'SEARCH_VIDEOS':
            const { query } = data

            if (query !== state.query) {
                state.items = []
                state.nextPageToken = ''
            }

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
            ;(state.items = []), (state.nextPageToken = '')
            return { ...state }
    }
    return state
}
