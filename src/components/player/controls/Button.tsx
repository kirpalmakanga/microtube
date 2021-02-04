import { FunctionComponent, ReactNode } from 'react';
import Icon from '../../Icon';

interface Props {
    className: string;
    icon: string;
    badge?: unknown;
    children?: ReactNode;
    ariaLabel: string;
    onClick: () => void;
}

const Button: FunctionComponent<Props> = ({
    children,
    icon,
    badge,
    ariaLabel,
    onClick,
    ...props
}) => (
    <button
        {...props}
        onClick={onClick}
        aria-label={ariaLabel}
        data-badge={badge}
    >
        <Icon className="icon" name={icon} />
    </button>
);

export default Button;
