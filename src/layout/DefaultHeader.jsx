import { connect } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { signIn, signOut } from '../actions/auth';

import Icon from '../components/Icon';
import Button from '../components/Button';

const DefaultHeader = ({
    isSignedIn,
    signIn,
    signOut,
    avatar,
    channelTitle,
    playlistTitle
}) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    let title = 'MicroTube';

    if (pathname.startsWith('/subscriptions')) {
        title = 'Subscriptions';
    }

    if (pathname.includes('/channel')) {
        title = channelTitle;
    }

    if (pathname.startsWith('/playlist')) {
        title = playlistTitle;
    }

    return (
        <div className="layout__header-row">
            {pathname !== '/' && pathname !== '/login' ? (
                <button
                    onClick={() => navigate(-1)}
                    className="layout__back-button icon-button"
                    to="/"
                    aria-label="Go to homepage"
                >
                    <Icon name="arrow-left" />
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
                    icon="person"
                >
                    {avatar ? <img src={avatar} alt="avatar" /> : null}
                </Button>
            </nav>
        </div>
    );
};

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

const mapDispatchToProps = {
    signIn,
    signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultHeader);
