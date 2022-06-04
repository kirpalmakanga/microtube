import { Component, splitProps } from 'solid-js';
import Icon from '../../Icon';

interface Props {
    class: string;
    classList?: { [key: string]: boolean };
    icon: string;
    badge?: unknown;
    children?: string | Element;
    ariaLabel: string;
    onClick: () => void;
}

const Button: Component<Props> = (props) => {
    const [localProps, buttonProps] = splitProps(props, [
        'ariaLabel',
        'badge',
        'icon'
    ]);

    return (
        <button
            {...buttonProps}
            aria-label={localProps.ariaLabel}
            data-badge={localProps.badge}
        >
            <Icon name={localProps.icon} />
        </button>
    );
};

export default Button;
