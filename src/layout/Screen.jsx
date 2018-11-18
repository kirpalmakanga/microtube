import React, { PureComponent } from 'react';

import Prompt from '../components/Prompt';

class Screen extends PureComponent {
  render() {
    const { children } = this.props;

    return [
      <main className='layout__content' key='layout-content'>
        {children}
      </main>,
      <Prompt key='prompt' />
    ];
  }
}
export default Screen;
