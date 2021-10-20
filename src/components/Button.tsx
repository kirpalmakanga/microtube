import { Component } from 'solid-js';

import Icon from './Icon';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export interface ButtonProps {
    className?: string;
    icon?: string;
    title?: string;
    type?: ButtonType;
    form?: string;
    onClick?: () => void;
    children?: Element;
}

const Button: Component<ButtonProps> = ({
    icon,
    type = 'button',
    title = '',
    children,
    ...props
}) => (
    <button type={type} {...props}>
        {icon ? <Icon name={icon} /> : null}

        {title ? <span>{title}</span> : null}

        {children}
    </button>
);

export default Button;
