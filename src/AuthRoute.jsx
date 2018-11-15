import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

class AuthRoute extends Component {
    render() {
        const { isSignedIn, component: Component, ...props } = this.props;

        return (
            <Route
                {...props}
                render={() =>
                    isSignedIn ? <Component /> : <Redirect to="/login" />
                }
            />
        );
    }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(AuthRoute);
