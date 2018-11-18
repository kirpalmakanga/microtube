import React, { PureComponent } from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

class Loader extends PureComponent {
  render() {
    const { isActive } = this.props;

    return (
      <Fade in={isActive} unmountOnExit>
        <div className='loader'>
          <Icon className='rotating' name='loading' />
        </div>
      </Fade>
    );
  }
}

export default Loader;
