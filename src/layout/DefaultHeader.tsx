import { Link, useLocation, useNavigate } from 'solid-app-router';
import { createSignal, Show } from 'solid-js';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Img from '../components/Img';
import Title from '../components/meta/Title';
import useAppTitle from '../store/hooks/app-title';
import { useAuth } from '../store/hooks/auth';

const DefaultHeader = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, { signIn, signOut }] = useAuth();
    const [isMenuOpen, setMenuState] = createSignal(false);

    const title = useAppTitle();

    const handleClickUser = () => setMenuState(!isMenuOpen());

    const handleLogging = () => {
        if (user.isSignedIn) signOut();
        else signIn();

        setMenuState(false);
    };

    return (
        <div className="layout__header-row">
            <Title>{title()}</Title>

            <Show
                when={
                    user.isSignedIn &&
                    location.pathname !== '/' &&
                    location.pathname !== '/login'
                }
            >
                <Button
                    onClick={() => navigate('/')}
                    className="layout__back-button icon-button"
                    aria-label="Go to homepage"
                    icon="arrow-left"
                />
            </Show>

            <span className="layout__title">
                <span className="layout__title-inner">{title()}</span>
            </span>

            <nav className="navigation">
                <Show when={user.isSignedIn}>
                    <Link
                        className="navigation__link icon-button"
                        aria-label="Open search"
                        href="/search"
                    >
                        <Icon name="search" />
                    </Link>

                    <Show when={location.pathname !== '/'}>
                        <Link
                            className="navigation__link icon-button"
                            aria-label="Playlists"
                            href="/"
                        >
                            <Icon name="folder" />
                        </Link>
                    </Show>

                    <Show when={location.pathname !== '/subscriptions'}>
                        <Link
                            className="navigation__link icon-button"
                            href="/subscriptions"
                            aria-label="Open subscriptions"
                        >
                            <Icon name="users" />
                        </Link>
                    </Show>
                </Show>

                <div className="navigation__menu">
                    <Button
                        className="navigation__link icon-button avatar"
                        onClick={handleClickUser}
                        icon={user.isSignedIn && !user.picture ? 'user' : ''}
                    >
                        <Show when={user.picture}>
                            <Img src={user.picture} alt="avatar" />
                        </Show>
                    </Button>

                    <Show when={isMenuOpen()}>
                        <div className="navigation__menu__content shadow--2dp">
                            <Show when={user.name}>
                                <p className="navigation__menu__content__text">
                                    {user.name}
                                </p>
                            </Show>
                            <Button
                                className="button shadow--2dp"
                                icon="log-out"
                                title={user.isSignedIn ? 'Log out' : 'Log in'}
                                onClick={handleLogging}
                            ></Button>
                        </div>
                    </Show>
                </div>
            </nav>
        </div>
    );
};

export default DefaultHeader;
