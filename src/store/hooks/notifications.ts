import { useEffect, useCallback } from 'react';
import { useStore } from '../index';
import { delay } from '../../lib/helpers';

export default () => {
    const [{ notifications }, dispatch] = useStore();
    const { message: storedMessage } = notifications;

    return [
        notifications,
        {
            openNotification: async (message: string) => {
                dispatch({ type: 'notifications/OPEN', data: { message } });

                await delay(4000);

                if (storedMessage) {
                    dispatch({ type: 'notifications/CLOSE' });

                    await delay(300);

                    dispatch({ type: 'notifications/CLEAR_MESSAGE' });
                }
            },

            closeNotification: async () => {
                dispatch({ type: 'notifications/CLOSE' });

                await delay(300);

                dispatch({ type: 'notifications/CLEAR_MESSAGE' });
            }
        }
    ];
};
