import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';

class Fade extends PureComponent {
  render() {
    const { children, unmountOnExit, in: inProp } = this.props;

    return (
      <CSSTransition
        in={inProp}
        timeout={300}
        classNames='fade'
        unmountOnExit={unmountOnExit}
      >
        {children}
      </CSSTransition>
    );
  }
}

export default Fade;
