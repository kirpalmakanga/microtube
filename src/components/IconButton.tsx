import { Component, Show } from 'solid-js';
import Button from './Button';
import Icon from './Icon';
import { Transition } from 'solid-transition-group';

interface Props {
    icon: string;
    onClick: () => void;
    class?: string;
    classList?: { [key: string]: boolean };
    iconClass?: string;
    badge?: string | number;
    isActive?: boolean;
    disabled?: boolean;
}

const IconButton: Component<Props> = (props) => {
    return (
        <Button
            class={`relative flex items-center justify-center h-8 w-8 rounded bg-primary-800 hover:bg-primary-700 transition-colors ${
                props.class || ''
            }`}
            classList={props.classList}
            onClick={props.onClick}
            disabled={props.disabled}
            icon={props.icon}
            iconClass={props.iconClass}
        >
            <Transition name="fade">
                <Show when={props.badge}>
                    <span class="absolute -top-2.5 -right-2.5 bg-red-500 px-1 py-0.125em text-xs rounded">
                        {props.badge}
                    </span>
                </Show>
            </Transition>
        </Button>
    );
};

export default IconButton;
