import { useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useStore } from '../store';
import { signIn, signOut } from '../store/actions/user';

import Icon from '../components/Icon';
import Button from '../components/Button';

const DefaultHeader = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [
        {
            user: { picture, isSignedIn },
            playlistItems: { playlistTitle },
            channel: { channelTitle }
        },
        dispatch
    ] = useStore();

    const handleClickUser = useCallback(
        () => dispatch(isSignedIn ? signOut() : signIn()),
        [isSignedIn]
    );

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
                    onClick={handleClickUser}
                    title={isSignedIn ? 'Log out' : 'Log in'}
                    icon="user"
                >
                    {picture ? <img src={picture} alt="avatar" /> : null}
                </Button>
            </nav>
        </div>
    );
};

export default DefaultHeader;
