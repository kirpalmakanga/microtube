import React, { PureComponent } from 'react';
import Icon from '../../Icon';

class Button extends PureComponent {
    render() {
        const {
            icon,
            iconTransitionClass = '',
            badge,
            ariaLabel,
            ...props
        } = this.props;

        return (
            <button {...props} aria-label={ariaLabel} data-badge={badge}>
                <Icon
                    className={['icon', iconTransitionClass].join(' ')}
                    name={icon}
                />
            </button>
        );
    }
}

export default Button;
