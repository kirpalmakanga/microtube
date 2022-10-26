import { NavLink, useLocation } from '@solidjs/router';
import { createSignal, Show } from 'solid-js';
import { Transition } from 'solid-transition-group';
import Button from '../components/Button';
import Icon from '../components/Icon';
import Img from '../components/Img';
import Title from '../components/meta/Title';
import { useAppTitle } from '../store/app';
import { useAuth } from '../store/user';

const HeadTitle = (props: { text: string }) => <Title>{props.text}</Title>;

const DefaultHeader = () => {
    const location = useLocation();
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
        <div class="flex flex-grow items-center px-4">
            <HeadTitle text={title()} />

            <Show
                when={
                    user.isSignedIn &&
                    location.pathname !== '/' &&
                    location.pathname !== '/login'
                }
            >
                <NavLink
                    class="group relative flex items-center justify-center h-12 w-12 -ml-4 bg-primary-900"
                    href="/"
                >
                    <Icon
                        class="transition text-light-50 group-hover:text-opacity-50 w-6 h-6"
                        name="arrow-left"
                    />
                </NavLink>
            </Show>

            <span class="flex flex-grow overflow-hidden">
                <span class="font-montserrat text-light-50 overflow-ellipsis whitespace-nowrap overflow-hidden">
                    {title()}
                    {/* erio erofi erio fiogntriun dfsoincfqfoiqjsd fionqonfg dso
                    fqno */}
                </span>
            </span>

            <nav class="flex gap-4 ml-2">
                <Show when={user.isSignedIn}>
                    <NavLink
                        class="group h-12 flex items-center justify-center"
                        href="/search"
                    >
                        <Icon
                            class="transition text-light-50 group-hover:text-opacity-50 w-6 h-6"
                            name="search"
                        />
                    </NavLink>

                    <Show when={location.pathname !== '/'}>
                        <NavLink
                            class="group h-12 flex items-center justify-center"
                            href="/"
                        >
                            <Icon
                                class="transition text-light-50 group-hover:text-opacity-50 w-6 h-6"
                                name="folder"
                            />
                        </NavLink>
                    </Show>

                    <Show when={location.pathname !== '/subscriptions'}>
                        <NavLink
                            class="group h-12 flex items-center justify-center"
                            href="/subscriptions"
                        >
                            <Icon
                                class="transition text-light-50 group-hover:text-opacity-50 w-6 h-6"
                                name="users"
                            />
                        </NavLink>
                    </Show>
                </Show>

                <div class="relative">
                    <Button
                        class="group h-12 flex items-center justify-center"
                        onClick={handleClickUser}
                        icon={user.isSignedIn && !user.picture ? 'user' : ''}
                    >
                        <Show when={user.picture}>
                            <Img
                                class="group-hover:opacity-50 transition-opacity w-8 h-8 rounded-full"
                                src={user.picture}
                            />
                        </Show>
                    </Button>

                    <Transition name="fade">
                        <Show when={isMenuOpen()}>
                            <div class="absolute top-full right-0 p-4 bg-primary-900 shadow">
                                <Show when={user.name}>
                                    <p class="text-light-50 text-xl font-montserrat mb-4">
                                        {user.name}
                                    </p>
                                </Show>

                                <Button
                                    class="flex items-center justify-center gap-2 px-4 py-1 bg-primary-800 hover:bg-primary-700 transition-colors text-light-50 font-montserrat rounded shadow"
                                    icon="log-out"
                                    iconClass="h-6 w-6"
                                    title={
                                        user.isSignedIn ? 'Log out' : 'Log in'
                                    }
                                    onClick={handleLogging}
                                />
                            </div>
                        </Show>
                    </Transition>
                </div>
            </nav>
        </div>
    );
};

export default DefaultHeader;
