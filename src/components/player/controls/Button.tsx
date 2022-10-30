import { Component, Show, splitProps } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Icon from '../../Icon';

interface Props {
    classList?: { [key: string]: boolean };
    icon: string;
    badge?: string | number;
    children?: string | Element;
    isActive?: boolean;
    onClick: () => void;
}

const Button: Component<Props> = (props) => {
    const [localProps, buttonProps] = splitProps(props, [
        'isActive',
        'badge',
        'icon'
    ]);

    return (
        <button
            {...buttonProps}
            class="relative flex flex-shrink-0 items-center justify-center bg-primary-900 h-12 w-12 group after:(content-DEFAULT absolute bottom-0 left-0 right-0 h-2px bg-light-50 transition-opacity) <md:order-1"
            classList={{
                'after:opacity-0': !localProps.isActive,
                'after:opacity-100': localProps.isActive
            }}
        >
            <Icon
                class="text-light-50 group-hover:text-opacity-50 transition-colors w-6 h-6"
                name={localProps.icon}
            />

            <Transition name="fade">
                <Show when={localProps.badge}>
                    <span class="absolute top-2 right-2 bg-red-500 px-1 py-0.125em text-xs rounded">
                        {localProps.badge}
                    </span>
                </Show>
            </Transition>
        </button>
    );
};

export default Button;
