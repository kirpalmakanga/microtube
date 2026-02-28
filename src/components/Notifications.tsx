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
                <div class="absolute bottom-4 right-4 z-10 bg-primary-800 flex overflow-hidden rounded shadow ml-4">
                    <div class="flex-grow px-4 py-2 text-light-50">{notifications.message}</div>

                    <Show when={notifications.callback}>
                        <button
                            class="px-4 py-2 transition-colors text-light-50 bg-violet-500 hover:bg-violet-400"
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
