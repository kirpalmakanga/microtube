import React, { PureComponent } from 'react';
import { CSSTransition } from 'react-transition-group';

class Fade extends PureComponent {
  render() {
    const { children, in: inProp } = this.props;

    return (
      <CSSTransition in={inProp} timeout={500} classNames='fade' unmountOnExit>
        {children}
      </CSSTransition>
    );
  }
}

export default Fade;
