import { createSignal, Show } from 'solid-js';
import { Link, useNavigate, useLocation } from 'solid-app-router';

import Icon from '../components/Icon';
import Button from '../components/Button';
import Img from '../components/Img';

import useAppTitle from '../store/hooks/app-title';
import { useAuth } from '../store/hooks/auth';
import { Transition } from 'solid-transition-group';

const DefaultHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, { signIn, signOut }] = useAuth();
    const [isMenuOpen, setMenuState] = createSignal(false);

    const title = useAppTitle();

    const handleClickUser = () =>
        user.isSignedIn ? setMenuState(!isMenuOpen()) : signIn();

    const handleLoggingOut = () => {
        signOut();

        setMenuState(false);
    };

    return (
        <div className="layout__header-row">
            {location.pathname !== '/' && location.pathname !== '/login' ? (
                <Button
                    onClick={() => navigate('/')}
                    className="layout__back-button icon-button"
                    aria-label="Go to homepage"
                >
                    <Icon name="arrow-left" />
                </Button>
            ) : null}

            <span className="layout__title">
                <span className="layout__title-inner">{title()}</span>
            </span>

            <nav className="navigation">
                {user.isSignedIn ? (
                    <>
                        <Link
                            className="navigation__link icon-button"
                            aria-label="Open search"
                            href="/search"
                        >
                            <Icon name="search" />
                        </Link>

                        <Link
                            className="navigation__link icon-button"
                            aria-label="Playlists"
                            href="/"
                        >
                            <Icon name="folder" />
                        </Link>

                        <Link
                            className="navigation__link icon-button"
                            href="/subscriptions"
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
                        icon={!user.isSignedIn ? 'user' : ''}
                    >
                        <Show when={user.picture}>
                            <Img src={user.picture} alt="avatar" />
                        </Show>
                    </Button>

                    <Transition name="fade">
                        <Show when={user.isSignedIn && isMenuOpen()}>
                            <div className="navigation__menu__content shadow--2dp">
                                <p className="navigation__menu__content__text">
                                    {user.name}
                                </p>
                                <Button
                                    className="button shadow--2dp"
                                    icon="log-out"
                                    title={
                                        user.isSignedIn ? 'Log out' : 'Log in'
                                    }
                                    onClick={handleLoggingOut}
                                ></Button>
                            </div>
                        </Show>
                    </Transition>
                </div>
            </nav>
        </div>
    );
};

export default DefaultHeader;
