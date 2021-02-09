import { useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import { useStore } from '../store';
import { useSearch } from '../store/hooks/search';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';

import DropDown from '../components/DropDown';

const SearchHeader = () => {
    const navigate = useNavigate();
    const { query } = useParams();
    const [
        {
            search: { forMine }
        }
    ] = useStore();
    const [_, { setSearchTarget }] = useSearch();

    const handleFormSubmit = useCallback(
        (query) => {
            console.log('searchSubmit');

            navigate(`/search/${query}`, { replace: true });
        },
        [query]
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
                            onSelect={setSearchTarget}
                        />
                    ),
                    [forMine]
                )}
            </nav>
        </div>
    );
};

export default SearchHeader;
