import React, { Component } from 'react';
import { connect } from 'react-redux';

import { signIn } from '../api/youtube';

import { parseURLSearchParams } from '../lib/helpers';

import Button from '../components/Button';

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
        return (
            <div className="log-in">
                <Button
                    className="button shadow--2dp"
                    title="Log in"
                    onClick={signIn}
                />
            </div>
        );
    }
}

const mapStateToProps = ({ auth: { isSignedIn } }) => ({ isSignedIn });

export default connect(mapStateToProps)(Login);
