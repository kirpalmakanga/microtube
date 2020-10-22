import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import { closeScreen } from '../actions/youtube';

import DefaultHeader from './DefaultHeader';
import SearchHeader from './SearchHeader';

const Header = () => {
    const dispatch = useDispatch();

    const handleCloseScreen = () => dispatch(closeScreen());

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
