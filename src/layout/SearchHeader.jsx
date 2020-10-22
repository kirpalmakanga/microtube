import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

import { setSearchTarget } from '../actions/youtube';

const SearchHeader = () => {
    const forMine = useSelector(({ search: { forMine } }) => forMine);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { query } = useParams();

    const handleFormSubmit = (query) =>
        navigate(`/search/${query}`, { replace: true });

    const handleDropDownSelect = (value) =>
        dispatch(setSearchTarget(parseInt(value)));

    return (
        <div className="layout__header-row">
            <Link
                className="layout__back-button icon-button"
                to="/"
                aria-label="Close search"
            >
                <Icon name="arrow-left" />
            </Link>

            <SearchForm query={query} onSubmit={handleFormSubmit} />

            <nav className="navigation">
                {useMemo(
                    () => (
                        <DropDown
                            currentValue={forMine}
                            options={[
                                { label: 'All videos', value: 0 },
                                { label: 'My Videos', value: 1 }
                            ]}
                            onSelect={handleDropDownSelect}
                        />
                    ),
                    [forMine]
                )}
            </nav>
        </div>
    );
};

export default SearchHeader;
