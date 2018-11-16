import './assets/styles/app.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadAPI, loadAuth, listenAuth, getSignedInUser } from './api/youtube';

import Sprite from './components/Sprite';
import Player from './components/player/Player';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { apiLoaded: false };
  }

  signInUser = () => {
    const auth = getSignedInUser();

    auth.isSignedIn && this.props.signIn(auth);
  };

  async componentDidMount() {
    await loadAPI();

    await loadAuth();

    this.signInUser();

    this.setState({ apiLoaded: true }, this.props.listenAuthChange);
  }

  render() {
    const {
      state: { apiLoaded },
      props: { children }
    } = this;

    return [
      <Sprite key='icons' />,
      <div className='layout' key='layout'>
        {apiLoaded === true ? children : null}

        <Player />

        <div
          className={['loader', apiLoaded === true ? '' : 'is-active'].join(
            ' '
          )}
        />
      </div>
    ];
  }
}

const mapStateToProps = ({ notifications: { message } }) => ({
  message
});

const mapDispatchToProps = (dispatch) => ({
  listenAuthChange: () =>
    listenAuth((data) => dispatch({ type: 'SIGN_IN', data })),

  signIn: (data) => dispatch({ type: 'SIGN_IN', data })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
