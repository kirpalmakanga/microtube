import { useStore } from '..';

import {
    instance,
    getAuthorizationUrl,
    refreshAccessToken
} from '../../api/youtube';
import { signIntoDatabase, signOutOfDatabase } from '../../api/database';

import { rootInitialState, RootState } from '../_state';
import { createEffect } from 'solid-js';

export const useAuth = () => {
    const [{ user }, setState] = useStore();

    const refreshTokens = async () => {
        const data = await refreshAccessToken(user.refreshToken);

        setState('user', data);
    };

    const bindAccessTokens = async () => {
        instance.interceptors.request.use((config) => {
            config.headers = { Authorization: `Bearer ${user.accessToken}` };

            return config;
        });

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const {
                    response: { status },
                    config
                } = error;

                if ([401, 403].includes(status) && !config._retry) {
                    await refreshTokens();

                    config._retry = true;

                    return instance(config);
                }

                return Promise.reject(error);
            }
        );

        createEffect((previousAccessToken) => {
            const { idToken, accessToken } = user;

            if (accessToken && accessToken !== previousAccessToken) {
                (async () => {
                    try {
                        console.log('signIntoDatabase');

                        await signIntoDatabase(idToken, accessToken);
                    } catch (error) {
                        console.log('refreshTokens');

                        await refreshTokens();
                    }
                })();
            } else if (!accessToken) signOutOfDatabase();

            return accessToken;
        });
    };

    const signIn = async () => {
        const url = await getAuthorizationUrl();

        window.location.href = url;
    };

    const setUser = (data) => {
        setState('user', {
            ...data,
            isSignedIn: true
        });
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
