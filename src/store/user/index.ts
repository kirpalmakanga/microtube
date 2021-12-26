import { useStore } from '..';

import * as api from '../../api/youtube';
import { signIntoDatabase, signOutOfDatabase } from '../../api/database';
import { useNotifications } from '../notifications';

import { rootInitialState } from '../_state';

export const useAuth = () => {
    const [{ user }, setState] = useStore();
    const [, { openNotification }] = useNotifications();

    const getUserData = async () => {
        const { isSignedIn, idToken, accessToken, ...data } =
            await api.getSignedInUser();

        let id = '';

        if (isSignedIn) {
            let {
                user: { uid }
            } = await signIntoDatabase(idToken, accessToken);

            id = uid;
        }

        setState('user', {
            ...data,
            id,
            isSignedIn,
            idToken,
            accessToken
        });
    };

    const signIn = async () => {
        try {
            await api.signIn();
            setState('user', {
                isSigningIn: true
            });
            await getUserData();
        } catch (error) {
            if (error !== 'popup_closed_by_user') {
                openNotification('Connection cancelled.');
            } else {
                openNotification('Error signing user in.');
            }
        } finally {
            setState('user', {
                isSigningIn: false
            });
        }
    };

    const signOut = async () => {
        try {
            await api.signOut();
            await signOutOfDatabase();

            for (const [key, state] of Object.entries(rootInitialState())) {
                setState(key, state);
            }
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
