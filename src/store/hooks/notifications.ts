import { useCallback } from 'react';
import { useStore } from '..';
import { delay } from '../../lib/helpers';
import { Action, Dispatch, GetState } from '../helpers';

export const useNotifications = () => {
    const [{ notifications }, dispatch] = useStore();

    const closeNotification = useCallback(async () => {
        dispatch({ type: 'notifications/CLOSE' });

        await delay(300);

        dispatch({ type: 'notifications/CLEAR_MESSAGE' });
    }, []);

    const openNotification = useCallback(
        (message) =>
            dispatch(async (getState: GetState) => {
                dispatch({
                    type: 'notifications/OPEN',
                    payload: { message }
                });

                await delay(4000);

                const {
                    notifications: { isVisible }
                } = getState();

                if (isVisible) {
                    closeNotification();
                }
            }),
        []
    );

    return [
        notifications,
        {
            openNotification,
            closeNotification
        }
    ];
};
