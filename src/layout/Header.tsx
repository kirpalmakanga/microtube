import { Route, Routes } from '@solidjs/router';
import { Transition } from 'solid-transition-group';
import { usePlayer } from '../store/player';
import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [, { setScreenVisibility }] = usePlayer();

    return (
        <header
            class="layout__header shadow--2dp"
            onClick={() => setScreenVisibility(false)}
        >
            <Transition name="fade" mode="outin">
                <Routes>
                    <Route path="*" element={<DefaultHeader />} />

                    <Route path="/search" element={<SearchHeader />} />
                </Routes>
            </Transition>
        </header>
    );
};

export default Header;
