import { PureComponent } from 'react';
import Icon from '../../Icon';

import { preventDefault } from '../../../lib/helpers';

class Button extends PureComponent {
    render() {
        const {
            children,
            icon,
            badge,
            ariaLabel,
            onClick = () => {},
            ...props
        } = this.props;

        return (
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
    }
}

export default Button;
