import { useCallback } from 'react';
import { useStore } from '../store';
import useNotifications from '../store/hooks/notifications';

import Icon from './Icon';
import TranslateY from './animations/TranslateY';

const Notifications = () => {
    const [
        {
            notifications: { message, isActive }
        },
        dispatch
    ] = useStore();
    const [_, { closeNotification }] = useNotifications();

    const handleCloseNotification = useCallback(
        () => dispatch(closeNotification()),
        [message, isActive]
    );

    return (
        <TranslateY in={isActive} className="notification shadow--2dp">
            <div className="notification__content">
                <div className="notification__text">{message}</div>
                <button
                    className="notification__action icon-button"
                    onClick={handleCloseNotification}
                >
                    <Icon name="close" />
                </button>
            </div>
        </TranslateY>
    );
};

export default Notifications;
