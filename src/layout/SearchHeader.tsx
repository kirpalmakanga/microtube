import { useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useStore } from '../store';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

const setSearchTarget = (val: number) => {};

const SearchHeader = () => {
    const navigate = useNavigate();
    const { query } = useParams();
    const [
        {
            search: { forMine }
        },
        dispatch
    ] = useStore();

    const handleFormSubmit = useCallback(
        (query) => navigate(`/search/${query}`, { replace: true }),
        [query]
    );

    const handleDropDownSelect = useCallback(
        (value) => dispatch(setSearchTarget(parseInt(value))),
        [forMine]
    );

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
