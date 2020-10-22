import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { signIn, signOut } from '../actions/auth';

import Icon from '../components/Icon';
import Button from '../components/Button';

const DefaultHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isSignedIn, avatar, channelTitle, playlistTitle } = useSelector(
        ({
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
        })
    );
    const dispatch = useDispatch();

    const handleSignIn = () => dispatch(signIn());
    const handleSignOut = () => dispatch(signOut());

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
                            <Icon name="users" />
                        </Link>
                    </>
                ) : null}

                <Button
                    className="navigation__link icon-button"
                    onClick={isSignedIn ? handleSignOut : handleSignIn}
                    title={isSignedIn ? 'Log out' : 'Log in'}
                    icon="user"
                >
                    {avatar ? <img src={avatar} alt="avatar" /> : null}
                </Button>
            </nav>
        </div>
    );
};

export default DefaultHeader;
