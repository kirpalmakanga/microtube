import * as api from '../api/youtube';
import * as database from '../api/firebase';

import { connectToSocket } from './app';

export const getUserData = () => async (dispatch) => {
    const data = api.getSignedInUser();

    const { isSignedIn, idToken, accessToken } = data;

    if (!isSignedIn) {
        return;
    }

    const {
        user: { uid }
    } = await database.signIn(idToken, accessToken);

    data.user.id = uid;

    dispatch({
        type: 'auth/UPDATE_DATA',
        data
    });

    dispatch(listenForQueueUpdate());

    dispatch(connectToSocket());
};

export const signIn = () => async (dispatch) =>
    catchErrors(
        async () => {
            dispatch({ type: 'auth/UPDATE_DATA', data: { isSigningIn: true } });

            await api.signIn();

            await dispatch(getUserData());
        },
        ({ error }) =>
            error !== 'popup_closed_by_user' &&
            dispatch(notify({ message: 'Error signing in user.' })),
        () =>
            dispatch({
                type: 'auth/UPDATE_DATA',
                data: { isSigningIn: false }
            })
    );

export const signOut = () => async (dispatch) =>
    catchErrors(
        async () => {
            await api.signOut();

            await database.signOut();

            dispatch({ type: 'auth/SIGN_OUT' });
        },
        () => dispatch(notify({ message: 'Error signing out user.' }))
    );

export const closeScreen = () => (dispatch, getState) => {
    const {
        player: { showScreen }
    } = getState();

    showScreen && dispatch({ type: 'player/CLOSE_SCREEN' });
};
