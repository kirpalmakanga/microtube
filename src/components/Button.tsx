import { Component, JSX, JSXElement, Show, splitProps } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Icon from './Icon';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

export interface ButtonProps {
    class?: string;
    classList?: { [key: string]: boolean };
    icon?: string;
    iconClass?: string;
    title?: string;
    type?: ButtonType;
    form?: string;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: JSX.EventHandler<HTMLButtonElement, Event>;
    onBlur?: JSX.EventHandler<HTMLButtonElement, Event>;
    children?: JSXElement;
}

const Button: Component<ButtonProps> = (props) => {
    const [localProps, buttonProps] = splitProps(props, [
        'disabled',
        'class',
        'icon',
        'iconClass',
        'title',
        'isLoading',
        'children'
    ]);

    return (
        <button
            {...buttonProps}
            disabled={localProps.disabled || localProps.isLoading}
            classList={{ [localProps.class || '']: !!localProps.class }}
        >
            <span class="relative">
                <span
                    class="flex items-center gap-2 transition-opacity"
                    classList={{
                        'opacity-100': !localProps.isLoading,
                        'opacity-0': localProps.isLoading
                    }}
                >
                    <Show when={localProps.icon}>
                        <Icon
                            class={localProps.iconClass || 'w-5 h-5'}
                            name={localProps.icon || ''}
                        />
                    </Show>
                    <Show when={localProps.title}>
                        <span>{localProps.title}</span>
                    </Show>

                    {localProps.children}
                </span>

                <Transition name="fade">
                    <Show when={localProps.isLoading}>
                        <span class="absolute inset-0 flex items-center justify-center">
                            <Icon
                                class={localProps.iconClass || 'w-5 h-5'}
                                name="loading"
                            />
                        </span>
                    </Show>
                </Transition>
            </span>
        </button>
    );
};

export default Button;
