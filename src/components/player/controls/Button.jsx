import React, { PureComponent } from 'react';
import Icon from '../../Icon';

class Button extends PureComponent {
    render() {
        const {
            className,
            icon,
            iconTransitionClass = '',
            badge,
            onClick,
            ariaLabel
        } = this.props;

        return (
            <button
                className={className}
                onClick={onClick}
                aria-label={ariaLabel}
                data-badge={badge}
            >
                <Icon
                    className={['icon', iconTransitionClass].join(' ')}
                    name={icon}
                />
            </button>
        );
    }
}

export default Button;
