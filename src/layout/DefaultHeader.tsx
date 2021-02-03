import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useStore } from '../store';

import Icon from '../components/Icon';
import Button from '../components/Button';

import useAppTitle from '../store/hooks/app-title';
import { useAuth } from '../store/hooks/auth';

const DefaultHeader = () => {
    const { pathname } = useLocation();

    const [{ picture, isSignedIn }, { signIn, signOut }] = useAuth();

    const title = useAppTitle();

    const handleClickUser = useCallback(
        () => (isSignedIn ? signOut() : signIn()),
        [isSignedIn]
    );

    return (
        <div className="layout__header-row">
            {pathname !== '/' && pathname !== '/login' ? (
                <Link
                    to="/"
                    className="layout__back-button icon-button"
                    aria-label="Go to homepage"
                >
                    <Icon name="arrow-left" />
                </Link>
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
