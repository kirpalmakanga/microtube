import { useStore } from '..';
import { delay } from '../../lib/helpers';
import { GetState } from '../helpers';

export const useNotifications = () => {
    const [{ notifications }, setState] = useStore();

    const closeNotification = async () => {
        setState('notifications', {
            isVisible: false
        });

        await delay(300);

        setState('notifications', {
            message: ''
        });
    };

    const openNotification = async (message: string) => {
        setState('notifications', {
            isVisible: true,
            message
        });

        await delay(4000);

        const { isVisible } = notifications;

        if (isVisible) closeNotification();
    };

    return [
        notifications,
        {
            openNotification,
            closeNotification
        }
    ];
};
