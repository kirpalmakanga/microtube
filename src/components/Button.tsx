import { FunctionComponent, ReactNode } from 'react';

import Icon from './Icon';

type ButtonType = 'button' | 'submit' | 'reset' | undefined;

interface Props {
    className?: string;
    icon?: string;
    title?: string;
    type?: string;
    form?: string;
    onClick?: () => void;
    children?: ReactNode;
}

const Button: FunctionComponent<Props> = ({
    icon,
    type = 'button',
    title = '',
    children,
    ...props
}) => (
    <button type={type as ButtonType} {...props}>
        {icon ? <Icon name={icon} /> : null}

        {title ? <span>{title}</span> : null}

        {children}
    </button>
);

export default Button;
