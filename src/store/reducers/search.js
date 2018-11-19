const initialState = {
    items: [],
    nextPageToken: '',
    forMine: 0,
    query: ''
};

export default function(state = initialState, { type, data }) {
    switch (type) {
        case 'SET_SEARCH_MODE':
            const { forMine = 0 } = data;

            state.items = [];

            return { ...state, forMine };

        case 'SET_QUERY':
            return { ...state, query: data.query };

        case 'SEARCH_VIDEOS':
            const { query } = data;

            return { ...state, query };

        case 'SEARCH_VIDEOS_SUCCESS':
            const { items, nextPageToken, totalResults } = data;

            return {
                ...state,
                items: [...state.items, ...items],
                nextPageToken: nextPageToken || null,
                totalResults
            };

        case 'RESET_SEARCH':
            return { ...state, items: [], nextPageToken: '' };
    }
    return state;
}
