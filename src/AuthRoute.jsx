import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route } from 'react-router-dom';

import Loader from './components/Loader';
import Login from './containers/Login';

const AuthRoute = ({
    isSignedIn,
    isSigningIn,
    component: Container,
    ...props
}) => (
    <Route
        {...props}
        render={(componentProps) =>
            isSignedIn ? (
                <Container {...componentProps} />
            ) : isSigningIn ? (
                <Loader isActive />
            ) : (
                <Login {...componentProps} />
            )
        }
    />
);

const mapStateToProps = ({ auth: { isSignedIn, isSigningIn } }) => ({
    isSignedIn,
    isSigningIn
});

export default connect(mapStateToProps)(AuthRoute);
