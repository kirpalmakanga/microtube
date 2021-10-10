import { Routes, Route } from 'solid-app-router';

import { usePlayer } from '../store/hooks/player';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [{ isScreenVisible }, { closeScreen }] = usePlayer();

    const handleCloseScreen = () => isScreenVisible && closeScreen();

    return (
        <header
            className="layout__header shadow--2dp"
            onClick={handleCloseScreen}
        >
            <Routes>
                <Route path="*" element={<DefaultHeader />} />

                <Route path="/search" element={<SearchHeader />} />

                <Route path="/search/:query" element={<SearchHeader />} />
            </Routes>
        </header>
    );
};

export default Header;
