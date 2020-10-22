import Icon from '../../Icon';

import { preventDefault } from '../../../lib/helpers';

const Button = ({
    children,
    icon,
    badge,
    ariaLabel,
    onClick = () => {},
    ...props
}) => (
    <button
        {...props}
        onClick={preventDefault(onClick)}
        onFocus={preventDefault()}
        aria-label={ariaLabel}
        data-badge={badge}
    >
        <Icon className="icon" name={icon} />
    </button>
);

export default Button;
