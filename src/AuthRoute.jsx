import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

import Loader from './components/Loader';
import Login from './containers/Login';

class AuthRoute extends Component {
    render() {
        const {
            isSignedIn,
            isSigningIn,
            component: Container,
            ...props
        } = this.props;

        return (
            <Route
                {...props}
                render={(componentProps) =>
                    isSignedIn ? (
                        <Container {...componentProps} />
                    ) : isSigningIn ? (
                        <Loader isActive={true} />
                    ) : (
                        <Login {...componentProps} />
                    )
                }
            />
        );
    }
}

const mapStateToProps = ({ auth: { isSignedIn, isSigningIn } }) => ({
    isSignedIn,
    isSigningIn
});

export default connect(mapStateToProps)(AuthRoute);
