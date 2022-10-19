import { Route, Routes } from '@solidjs/router';
import { Transition } from 'solid-transition-group';
import { usePlayer } from '../store/player';
import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [, { setScreenVisibility }] = usePlayer();

    return (
        <header
            class="relative z-1 flex h-12 bg-primary-900 shadow"
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
