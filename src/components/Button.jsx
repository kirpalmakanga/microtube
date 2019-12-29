import { PureComponent } from 'react';

import Icon from './Icon';

class Button extends PureComponent {
    render() {
        const { children, icon, type = 'button', title, ...props } = this.props;

        return (
            <button type={type} aria-label={title} {...props}>
                {children ? children : icon ? <Icon name={icon} /> : title}
            </button>
        );
    }
}

export default Button;
