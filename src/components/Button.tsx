import { Component, JSXElement, Show, splitProps } from 'solid-js';
import Icon from './Icon';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export interface ButtonProps {
    className?: string;
    icon?: string;
    title?: string;
    type?: ButtonType;
    form?: string;
    disabled?: boolean;
    onClick?: () => void;
    children?: JSXElement;
}

const Button: Component<ButtonProps> = (props) => {
    const [localProps, buttonProps] = splitProps(props, [
        'icon',
        'title',
        'children'
    ]);

    return (
        <button {...buttonProps}>
            <Show when={localProps.icon}>
                <Icon name={localProps.icon || ''} />
            </Show>

            <Show when={localProps.title}>
                <span>{localProps.title}</span>
            </Show>

            {localProps.children}
        </button>
    );
};

export default Button;
