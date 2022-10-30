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
                <div class="absolute bottom-4 left-4 right-4 z-10 bg-primary-800 flex overflow-hidden rounded  shadow">
                    <div class="flex-grow px-4 py-2 text-light-50">
                        {notifications.message}
                    </div>

                    <Show when={notifications.callback}>
                        <button
                            class="px-4 py-2 transition-colors text-light-50 bg-primary-700 hover:bg-primary-600"
                            onClick={onValidate}
                        >
                            {notifications.callbackButtonText}
                        </button>
                    </Show>

                    <button
                        class="px-4 py-2 transition-colors text-light-50 bg-red-500 hover:bg-red-400"
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
