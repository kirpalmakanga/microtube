import * as api from '../../api/youtube';
import database from '../../api/database';

/* TODO: create useUser hook */

export const getUserData = async () => {
    const { isSignedIn, idToken, accessToken, ...data  } = api.getSignedInUser();
    let id = '';

    if(isSignedIn) {
        let {
            user: { uid }
        } = await database.signIn(idToken, accessToken);

        id = uid;
    }

    return {
        type: 'user/UPDATE_DATA',
        payload: {
            ...data,
            id,
            isSignedIn, 
            idToken,
            accessToken,
        }
    };
};

export const updateSignInStatus = () => ({ type: 'auth/UPDATE_DATA', data: { isSigningIn: true } });

export const signIn = async () => {
    try {
        await api.signIn();

        return getUserData();
    } catch (error) {
        console.error(error);
    }
}
    // catchErrors(
    //     async () => {

    //     },
    //     ({ error }) =>
    //         error !== 'popup_closed_by_user' &&
    //         dispatch(notify({ message: 'Error signing in user.' })),
    //     () =>
    //         dispatch({
    //             type: 'auth/UPDATE_DATA',
    //             data: { isSigningIn: false }
    //         })
    // );

export const signOut = async () => {
    try {
        await api.signOut();
        await database.signOut();

        return { type: 'user/SIGN_OUT' }
    } catch (error) {
        console.error(error);
    }
}
    // catchErrors(
    //     async () => {


    //         dispatch({ type: 'player/CLEAR_QUEUE', data: { clearAll: true } });

    //         dispatch();
    //     },
    //     () => dispatch(notify({ message: 'Error signing out user.' }))
    // );
