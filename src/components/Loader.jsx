import React, { PureComponent } from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

class Loader extends PureComponent {
    render() {
        const { isActive } = this.props;

        return (
            <Fade className="loader" in={isActive}>
                <Icon className="rotating" name="loading" />
            </Fade>
        );
    }
}

export default Loader;
