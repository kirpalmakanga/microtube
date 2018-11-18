import React, { PureComponent } from 'react';
import Fade from './animations/Fade';
import Icon from './Icon';

class Loader extends PureComponent {
  state = { show: false };

  onReveal = () => {};

  render() {
    const { isActive } = this.props;

    return (
      <Fade in={isActive}>
        <div className='loader'>
          <Icon className='rotating' name='loading' />
        </div>
      </Fade>
    );
  }
}

export default Loader;
