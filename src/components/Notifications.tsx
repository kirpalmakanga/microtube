import { Component, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import { useNotifications } from '../store/notifications';

const Notifications: Component = () => {
    const [notifications, { closeNotification }] = useNotifications();
    const onValidate = () => {
        const { callback } = notifications;

        if (callback) {
            closeNotification();

            callback();
        }
    };

    return (
        <Transition name="slide-up">
            <Show when={notifications.isVisible}>
                <div className="notification">
                    <div className="notification__text">
                        {notifications.message}
                    </div>

                    <Show when={notifications.callback}>
                        <button
                            className="notification__action icon-button"
                            onClick={onValidate}
                        >
                            {notifications.callbackButtonText}
                        </button>
                    </Show>

                    <button
                        className="notification__action icon-button is--close"
                        onClick={closeNotification}
                    >
                        Close
                    </button>
                </div>
            </Show>
        </Transition>
    );
};

export default Notifications;
