import React, { Component } from 'react';
import { connect } from 'react-redux';

import { parseURLSearchParams } from '../lib/helpers';

import Screen from '../layout/Screen';

class Login extends Component {
  redirectIfLogged = () => {
    const {
      isSignedIn,
      location: { search },
      history
    } = this.props;

    const { redirect = '/' } = parseURLSearchParams(search);

    isSignedIn && history.push(redirect);
  };

  componentDidUpdate() {
    this.redirectIfLogged();
  }

  componentDidMount() {
    this.redirectIfLogged();
  }

  render() {
    return <Screen>Login</Screen>;
  }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(Login);
