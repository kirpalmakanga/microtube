import { useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useStore } from '../store';
import { closeScreen } from '../store/actions/youtube';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const [
        {
            player: { showScreen }
        },
        dispatch
    ] = useStore();

    const handleCloseScreen = useCallback(
        () => showScreen && dispatch(closeScreen()),
        []
    );

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
