import { useStore } from '..';

import * as api from '../../api/youtube';
import { signIntoDatabase, signOutOfDatabase } from '../../api/database';
import { useNotifications } from './notifications';
import { rootInitialState } from '../state';
import { initialState } from '../state/_user';

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
            setState('user', {
                isSigningIn: true
            });

            await api.signIn();
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

            setState('user', initialState());

            setState(rootInitialState());
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
