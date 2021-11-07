import { Component, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useNotifications } from '../store/hooks/notifications';
import Icon from './Icon';

const Notifications: Component = () => {
    const [notifications, { closeNotification }] = useNotifications();

    return (
        <Transition name="slide-up">
            <Show when={notifications.isVisible}>
                <div className="notification__content">
                    <div className="notification__text">
                        {notifications.message}
                    </div>
                    <button
                        className="notification__action icon-button"
                        onClick={closeNotification}
                    >
                        <Icon name="close" />
                    </button>
                </div>
            </Show>
        </Transition>
    );
};

export default Notifications;
