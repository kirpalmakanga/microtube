import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signIn, signOut } from '../actions/youtube';

import Icon from '../components/Icon';
import Button from '../components/Button';

class DefaultHeader extends Component {
    getTitle = () => {
        const { route, channelTitle, playlistTitle } = this.props;

        let title = 'MicroTube';

        if (route.startsWith('/subscriptions')) {
            title = 'Subscriptions';
        }

        if (route.includes('/channel')) {
            title = channelTitle;
        }

        if (route.startsWith('/playlist')) {
            title = playlistTitle;
        }

        return title;
    };

    handleAuth = () => {
        const { isSignedIn, signUserIn, signUserOut } = this.props;

        if (!isSignedIn) {
            return signUserIn();
        }
        signUserOut();
    };

    render() {
        const {
            props: { isSignedIn, avatar, route },
            getTitle
        } = this;

        const title = getTitle();

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

                <span className="layout-title-wrapper">
                    <span className="layout-title">{title}</span>
                </span>

                <nav className="navigation">
                    <Link
                        className="navigation__link icon-button"
                        aria-label="Open search"
                        to="/search"
                    >
                        <Icon name="search" />
                    </Link>

                    {isSignedIn ? (
                        <>
                            <Link
                                className="navigation__link icon-button"
                                aria-label="Playlists"
                                to="/"
                            >
                                <Icon name="folder" />
                            </Link>
                            <Link
                                className="navigation__link icon-button"
                                to="/subscriptions"
                                aria-label="Open subscriptions"
                            >
                                <Icon name="subscriptions" />
                            </Link>
                        </>
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
    },
    playlistItems: { playlistTitle },
    channel: { channelTitle }
}) => ({
    isSignedIn,
    avatar,
    playlistTitle,
    channelTitle
});

const mapDispatchToProps = (dispatch) => ({
    signUserIn: (data) => dispatch(signIn(data)),

    signUserOut: () => dispatch(signOut())
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DefaultHeader);
