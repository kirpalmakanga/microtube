import React, { PureComponent } from 'react';

import Header from '../layout/Header';

import Prompt from '../components/Prompt';

class Screen extends PureComponent {
  render() {
    const { header: H, children } = this.props;

    return [
      H ? <H key='header' /> : <Header key='header' />,
      <main className='layout__content' key='layout-content'>
        {children}
      </main>,
      <Prompt key='prompt' />
    ];
  }
}
export default Screen;
