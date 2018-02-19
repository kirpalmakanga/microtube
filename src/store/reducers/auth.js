const initialState = {
    user: {
        userName: '',
        picture: '',
        channelId: ''
    },
    token: null,
    isSignedIn: false
}

export default function(state = initialState, { type, data }) {
    switch (type) {
        case 'SIGN_IN':
            return { ...state, ...data }

        case 'SIGN_OUT':
            return initialState
    }
    return state
}
