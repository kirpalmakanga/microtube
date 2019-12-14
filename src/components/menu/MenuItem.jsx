import React, { PureComponent } from 'react';
import Icon from '../Icon';

class MenuItem extends PureComponent {
    render() {
        const { title = '', icon = '', onClick = () => {} } = this.props;

        return (
            <button className="menu__item" type="button" onClick={onClick}>
                {icon ? <Icon name={icon} /> : null}

                <span>{title}</span>
            </button>
        );
    }
}

export default MenuItem;
