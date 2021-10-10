import { Show } from 'solid-js';
import { Transition } from 'solid-transition-group';

import { useStore } from '../store';
import { useNotifications } from '../store/hooks/notifications';

import Icon from './Icon';

const Notifications = () => {
    const [
        {
            notifications: { message, isVisible }
        }
    ] = useStore();
    const [, { closeNotification }] = useNotifications();

    return (
        <Transition name="slide-up">
            <Show when={isVisible}>
                <div className="notification__content">
                    <div className="notification__text">{message}</div>
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
