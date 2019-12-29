import { Component } from 'react';
import Fade from '../animations/Fade';
import { stopPropagation } from '../../lib/helpers';

class Menu extends Component {
    render() {
        const {
            isVisible = false,
            onClick = () => {},
            children = [],
            title = ''
        } = this.props;

        return (
            <Fade in={isVisible}>
                <div className="menu" onClick={onClick}>
                    <div className="menu__container  shadow--2dp">
                        {title ? (
                            <div
                                className="menu__header"
                                onClick={stopPropagation()}
                            >
                                {title}
                            </div>
                        ) : null}

                        <ul className="menu__items">
                            {children.map((child, i) => (
                                <li key={i}>{child}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Fade>
        );
    }
}

export default Menu;
