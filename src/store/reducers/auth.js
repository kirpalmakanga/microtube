const initialState = {
    user: {
        userName: '',
        picture: ''
    },
    isSignedIn: null
}

export default function(state = initialState, { type, data }) {
    console.log(type, data)
    switch (type) {
        case 'SIGN_IN':
            return { ...state, ...data }

        case 'SIGN_OUT':
            return initialState
    }
    return state
}
