import { FunctionComponent, ReactNode } from 'react';

import Icon from './Icon';

interface Props {
    className?: string;
    icon?: string;
    title?: string;
    type?: 'button' | 'submit';
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
    <button type={type} aria-label={title} {...props}>
        {children ? children : icon ? <Icon name={icon} /> : title}
    </button>
);

export default Button;
