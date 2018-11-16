import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

class AuthRoute extends Component {
  render() {
    const { isSignedIn, component: Component, ...props } = this.props;
    const { path } = props;

    return (
      <Route
        {...props}
        render={(componentProps) =>
          isSignedIn ? (
            <Component {...componentProps} />
          ) : (
            <Redirect to={`/login?redirect=${path}`} />
          )
        }
      />
    );
  }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(AuthRoute);
