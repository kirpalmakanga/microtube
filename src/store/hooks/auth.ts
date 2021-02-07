import { useCallback } from 'react';
import { useStore } from '..';

import * as api from '../../api/youtube';
import database from '../../api/database';
import { useNotifications } from './notifications';

export const useAuth = () => {
    const [{ user }, dispatch] = useStore();
    const [, { openNotification }] = useNotifications();

    const getUserData = useCallback(async () => {
        const {
            isSignedIn,
            idToken,
            accessToken,
            ...data
        } = api.getSignedInUser();
        let id = '';

        if (isSignedIn) {
            let {
                user: { uid }
            } = await database.signIn(idToken, accessToken);

            id = uid;
        }

        dispatch({
            type: 'user/UPDATE_DATA',
            payload: {
                ...data,
                id,
                isSignedIn,
                idToken,
                accessToken
            }
        });
    }, []);

    const signIn = useCallback(async () => {
        try {
            dispatch({
                type: 'user/UPDATE_DATA',
                payload: { isSigningIn: true }
            });

            await api.signIn();
            await getUserData();
        } catch (error) {
            if (error !== 'popup_closed_by_user') {
                openNotification('Error signing in user.');
            }
        } finally {
            dispatch({
                type: 'user/UPDATE_DATA',
                payload: { isSigningIn: false }
            });
        }
    }, []);

    const signOut = async () => {
        try {
            await api.signOut();
            await database.signOut();

            dispatch({ type: 'user/SIGN_OUT' });
        } catch (error) {
            console.error(error);
        }
    };

    return [
        user,
        {
            getUserData,
            signIn,
            signOut
        }
    ];
};
