import { useCallback } from 'react';
import { useStore } from '..';
import { delay } from '../../lib/helpers';

export const useNotifications = () => {
    const [{ notifications }, dispatch] = useStore();

    const closeNotification = useCallback(async () => {
        dispatch({ type: 'notifications/CLOSE' });

        await delay(300);

        dispatch({ type: 'notifications/CLEAR_MESSAGE' });
    }, []);

    const openNotification = useCallback(async (message: string) => {
        dispatch({
            type: 'notifications/OPEN',
            payload: { message }
        });

        await delay(4000);

        const { isVisible } = notifications;

        if (isVisible) {
            closeNotification();
        }
    }, []);

    return [
        notifications,
        {
            openNotification,
            closeNotification
        }
    ];
};
