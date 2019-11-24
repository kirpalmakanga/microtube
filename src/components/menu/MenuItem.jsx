import React, { PureComponent } from 'react';
import Icon from '../Icon';

class MenuItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = props;
    }

    render() {
        const { title = '', icon = '', onClick = () => {} } = this.state;

        return (
            <button className="menu__item" type="button" onClick={onClick}>
                <Icon name={icon} />

                <span>{title}</span>
            </button>
        );
    }
}
// const MenuItem = ({ title = '', icon = '', onClick = () => {} }) => (
//     <button className="menu__item" type="button" onClick={onClick}>
//         <Icon name={icon} />

//         <span>{title}</span>
//     </button>
// );

export default MenuItem;
