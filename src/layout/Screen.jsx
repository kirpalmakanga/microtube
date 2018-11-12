import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import Player from '../components/player/Player';
import Prompt from '../components/Prompt';

class Screen extends Component {
  render() {
    const { children, isSignedIn } = this.props;

    return (
      <div className='layout'>
        <Header />

        <main className='layout__content'>{isSignedIn ? children : null}</main>

        <Player />

        <Prompt />

        {/* {message ? <Notifications /> : null} */}
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(Screen);