import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { signIn, signOut } from '../actions/auth';

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

    render() {
        const {
            props: { isSignedIn, signIn, signOut, avatar, route, history },
            getTitle
        } = this;

        const title = getTitle();

        return (
            <div className="layout__header-row">
                {route !== '/' && route !== '/login' ? (
                    <button
                        onClick={() => history.goBack()}
                        className="layout__back-button icon-button"
                        to="/"
                        aria-label="Go to homepage"
                    >
                        <Icon name="back" />
                    </button>
                ) : null}

                <span className="layout__title">
                    <span className="layout__title-inner">{title}</span>
                </span>

                <nav className="navigation">
                    {isSignedIn ? (
                        <>
                            <Link
                                className="navigation__link icon-button"
                                aria-label="Open search"
                                to="/search"
                            >
                                <Icon name="search" />
                            </Link>

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
                        onClick={isSignedIn ? signOut : signIn}
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

const mapStateToProps = (
    {
        auth: {
            isSignedIn,
            user: { picture: avatar }
        },
        playlistItems: { playlistTitle },
        channel: { channelTitle }
    },
    { location: { pathname: route } }
) => ({
    isSignedIn,
    avatar,
    playlistTitle,
    channelTitle,
    route
});

const mapDispatchToProps = {
    signIn,
    signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);
