import './assets/styles/app.scss';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loadAPI, listenAuth } from './api/youtube';

import Sprite from './components/Sprite';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { apiLoaded: false };
  }

  async componentDidMount() {
    await loadAPI();

    this.setState({ apiLoaded: true }, this.props.authenticateUser);
  }

  render() {
    const {
      state: { apiLoaded },
      props: { children, isSignedIn }
    } = this;

    return [<Sprite key='icons' />, apiLoaded === true ? children : null];
  }
}

const mapStateToProps = ({
  auth: { isSignedIn },
  notifications: { message }
}) => ({
  isSignedIn,
  message
});

const mapDispatchToProps = (dispatch) => ({
  authenticateUser: () =>
    listenAuth((data) => dispatch({ type: 'SIGN_IN', data })),

  signIn: (data) => dispatch({ type: 'SIGN_IN', data })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
