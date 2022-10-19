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
                <div class="absolute bottom-0 left-0 right-0 z-1 min-h-12 bg-primary-900 flex">
                    <div class="flex-grow p-4 text-light-50">
                        {notifications.message}
                    </div>

                    <Show when={notifications.callback}>
                        <button
                            class="p-4 transition-colors text-light-50 bg-primary-800 hover:bg-primary-700"
                            onClick={onValidate}
                        >
                            {notifications.callbackButtonText}
                        </button>
                    </Show>

                    <button
                        class="p-4 transition-colors text-light-50 bg-red-500 hover:bg-red-400"
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
