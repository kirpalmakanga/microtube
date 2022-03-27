import { Route, Routes } from 'solid-app-router';
import { usePlayer } from '../store/player';
import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [, { setScreenVisibility }] = usePlayer();

    return (
        <header
            className="layout__header shadow--2dp"
            onClick={() => setScreenVisibility(false)}
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
