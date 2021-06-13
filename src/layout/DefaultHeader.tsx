import { useCallback, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import Fade from '../components/animations/Fade';
import Icon from '../components/Icon';
import Button from '../components/Button';

import useAppTitle from '../store/hooks/app-title';
import { useAuth } from '../store/hooks/auth';
import Img from '../components/Img';

const DefaultHeader = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [{ name, picture, isSignedIn }, { signIn, signOut }] = useAuth();
    const [isMenuOpen, setMenuState] = useState(false);

    const title = useAppTitle();

    const handleClickUser = useCallback(
        () => (isSignedIn ? setMenuState(!isMenuOpen) : signIn()),
        [isSignedIn, isMenuOpen]
    );

    const handleLoggingOut = useCallback(() => {
        signOut();

        setMenuState(false);
    }, []);

    return (
        <div className="layout__header-row">
            {pathname !== '/' && pathname !== '/login' ? (
                <Button
                    onClick={() =>
                        navigate(-(pathname.endsWith('/videos') ? 2 : 1))
                    }
                    className="layout__back-button icon-button"
                    aria-label="Go to homepage"
                >
                    <Icon name="arrow-left" />
                </Button>
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
                <div className="navigation__menu">
                    <Button
                        className="navigation__link icon-buttona avatar"
                        onClick={handleClickUser}
                        icon={!isSignedIn ? 'user' : ''}
                    >
                        {picture ? <Img src={picture} alt="avatar" /> : null}
                    </Button>
                    <Fade in={isSignedIn && isMenuOpen}>
                        <div className="navigation__menu__content">
                            <p className="navigation__menu__content__text">
                                {name}
                            </p>
                            <Button
                                className="button shadow--2dp"
                                icon="log-out"
                                title={isSignedIn ? 'Log out' : 'Log in'}
                                onClick={handleLoggingOut}
                            ></Button>
                        </div>
                    </Fade>
                </div>
            </nav>
        </div>
    );
};

export default DefaultHeader;
