import React, { PureComponent } from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

class Loader extends PureComponent {
    render() {
        const { isActive, style } = this.props;

        return (
            <Fade className="loader" in={isActive}>
                <div className="loader__background" style={style} />
                <Icon className="rotating" name="loading" />
            </Fade>
        );
    }
}

export default Loader;
