import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import {
    signIn,
    signOut,
    getPlaylistTitle,
    getChannelTitle
} from '../api/youtube';

import Icon from '../components/Icon';
import Button from '../components/Button';

class DefaultHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: 'MicroTube'
        };
    }

    setTitle = async () => {
        const {
            location: { pathname: route }
        } = this.props;

        let title = 'MicroTube';

        if (route.includes('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (route.includes('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (route.includes('/channel')) {
            title = await getChannelTitle(route.slice(1).split('/')[1]);
        }

        if (route.includes('/playlist')) {
            title = await getPlaylistTitle(route.slice(1).split('/')[1]);
        }

        title !== this.state.title && this.setState({ title });
    };

    componentDidMount = () => {
        this.setTitle();
    };

    componentDidUpdate = () => {
        this.setTitle();
    };

    handleAuth = async () => {
        const { isSignedIn, signUserIn, signUserOut } = this.props;

        if (!isSignedIn) {
            const data = await signIn();

            return signUserIn(data);
        }

        await signOut();

        signUserOut();
    };

    render() {
        const {
            props: {
                isSignedIn,
                avatar,
                location: { pathname: route }
            },
            state: { title }
        } = this;

        return (
            <div className="layout__header-row">
                {route !== '/' && route !== '/login' ? (
                    <Link
                        className="layout__back-button icon-button"
                        to="/"
                        aria-label="Go to homepage"
                    >
                        <Icon name="back" />
                    </Link>
                ) : null}

                <Helmet key="headers" title={title} />
                <span className="layout-title">{title}</span>

                <nav className="navigation">
                    <Link
                        className="navigation__link icon-button"
                        aria-label="Open search"
                        to="/search"
                    >
                        <Icon name="search" />
                    </Link>

                    {isSignedIn ? (
                        <Link
                            className="navigation__link icon-button"
                            to="/subscriptions"
                            aria-label="Open subscriptions"
                        >
                            <Icon name="subscriptions" />
                        </Link>
                    ) : null}

                    <Button
                        className="navigation__link icon-button"
                        onClick={this.handleAuth}
                        title={isSignedIn ? 'Log out' : 'Log in'}
                        icon="account"
                    >
                        {avatar ? <img src={avatar} alt="avatar" /> : null}
                    </Button>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = ({
    auth: {
        isSignedIn,
        user: { picture: avatar }
    }
}) => ({
    isSignedIn,
    avatar
});

const mapDispatchToProps = (dispatch) => ({
    signUserIn: (data) => dispatch({ type: 'auth/SIGN_IN', data }),

    signUserOut: () => dispatch({ type: 'SIGN_OUT' })
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultHeader);
