import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signIn } from '../actions/youtube';

import Button from '../components/Button';
import Placeholder from '../components/Placeholder';

class Login extends Component {
    render() {
        const { signIn } = this.props;
        return (
            <Placeholder
                icon="lock"
                text="You must be logged in to access this content."
            >
                <Button
                    className="button shadow--2dp"
                    title="Log in"
                    onClick={signIn}
                />
            </Placeholder>
        );
    }
}

const mapDispatchToProps = {
    signIn
};

export default connect(
    () => ({}),
    mapDispatchToProps
)(Login);
