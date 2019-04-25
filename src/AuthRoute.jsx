import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

import Login from './containers/Login';

class AuthRoute extends Component {
    render() {
        const { isSignedIn, component: Container, ...props } = this.props;

        return (
            <Route
                {...props}
                render={(componentProps) =>
                    isSignedIn ? (
                        <Container {...componentProps} />
                    ) : (
                        <Login {...componentProps} />
                    )
                }
            />
        );
    }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(AuthRoute);
