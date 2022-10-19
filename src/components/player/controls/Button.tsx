import { Component, splitProps } from 'solid-js';
import Icon from '../../Icon';

interface Props {
    classList?: { [key: string]: boolean };
    icon: string;
    badge?: unknown;
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
            class="relative flex items-center justify-center bg-primary-900 h-12 w-12 group"
            classList={{
                'after:(content-DEFAULT absolute left-0 right-0 bottom-0 h-2px bg-light-50)':
                    localProps.isActive
            }}
            data-badge={localProps.badge}
        >
            <Icon
                class="text-light-50 group-hover:text-opacity-50 transition-colors w-6 h-6"
                name={localProps.icon}
            />
        </button>
    );
};

export default Button;
