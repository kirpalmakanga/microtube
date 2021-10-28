import { Component, JSXElement, Show } from 'solid-js';

import Icon from './Icon';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export interface ButtonProps {
    className?: string;
    icon?: string;
    title?: string;
    type?: ButtonType;
    form?: string;
    onClick?: () => void;
    children?: JSXElement;
}

const Button: Component<ButtonProps> = ({
    icon,
    title,
    children,
    ...props
}) => (
    <button {...props}>
        <Show when={icon}>
            <Icon name={icon} />
        </Show>

        <Show when={title}>
            <span>{title}</span>
        </Show>

        {children}
    </button>
);

export default Button;
