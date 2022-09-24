import { useStore } from '..';

import {
    instance,
    getAuthorizationUrl,
    refreshAccessToken
} from '../../api/youtube';
import { signIntoDatabase, signOutOfDatabase } from '../../api/database';

import { rootInitialState, RootState } from '../_state';

/* TODO: find where to sign in database (signIntoDatabase(idToken, accessToken)) */

export const useAuth = () => {
    const [{ user }, setState] = useStore();

    const bindAccessTokens = async () => {
        instance.interceptors.request.use((config) => {
            const { accessToken } = user;
            config.headers = { Authorization: `Bearer ${accessToken}` };

            return config;
        });

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const { refreshToken } = user;
                const {
                    response: { status },
                    config
                } = error;

                if (status === 403 && !config._retry) {
                    const accessToken = await refreshAccessToken(refreshToken);

                    setState('user', { accessToken });

                    config._retry = true;

                    return instance(config);
                }

                return Promise.reject(error);
            }
        );
    };

    const signIn = async () => {
        const url = await getAuthorizationUrl();

        window.location.href = url;
    };

    const setInterceptors = () => {};

    const setUser = (data) => {
        setState('user', {
            ...data,
            isSignedIn: true
        });

        setInterceptors();
    };

    const signOut = async () => {
        try {
            await signOutOfDatabase();

            for (const [key, state] of Object.entries(rootInitialState())) {
                setState(key as keyof RootState, state);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [
        user,
        {
            bindAccessTokens,
            setUser,
            signIn,
            signOut
        }
    ] as const;
};
