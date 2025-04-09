import { Match, Switch } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { usePlayer } from '../store/player';
import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [, { setScreenVisibility }] = usePlayer();
    const location = useLocation();

    const handleClickHeader = () => setScreenVisibility(false);

    return (
        <header
            class="relative z-1 flex h-12 bg-primary-900 shadow"
            onClick={handleClickHeader}
        >
            <Switch>
                <Match when={location.pathname.startsWith('/search')}>
                    <SearchHeader />
                </Match>

                <Match when={true}>
                    <DefaultHeader />
                </Match>
            </Switch>
        </header>
    );
};

export default Header;
