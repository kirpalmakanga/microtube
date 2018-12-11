import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Route, Redirect } from 'react-router-dom';

class AuthRoute extends Component {
    render() {
        const { isSignedIn, component: Component, ...props } = this.props;

        return (
            <Route
                {...props}
                render={(componentProps) =>
                    isSignedIn ? (
                        <Component {...componentProps} />
                    ) : (
                        <Redirect
                            to={`/login?redirect=${props.location.pathname}`}
                        />
                    )
                }
            />
        );
    }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(AuthRoute);
