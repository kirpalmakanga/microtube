import { Link, useSearchParams } from 'solid-app-router';
import DropDown from '../components/DropDown';
import Icon from '../components/Icon';
import Title from '../components/meta/Title';
import SearchForm from '../components/SearchForm';
import { useAppTitle } from '../store/app';
import { useSearch } from '../store/search';

const SearchHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, { setSearchTarget }] = useSearch();
    const title = useAppTitle();

    const handleFormSubmit = (query: string) =>
        setSearchParams({ query }, { replace: true });

    return (
        <div className="layout__header-row">
            <Title>{title()}</Title>

            <Link
                className="layout__back-button icon-button"
                href="/"
                aria-label="Close search"
            >
                <Icon name="arrow-left" />
            </Link>

            <SearchForm
                query={searchParams.query || ''}
                onSubmit={handleFormSubmit}
            />

            <nav className="navigation">
                <DropDown
                    currentValue={search.forMine}
                    options={[
                        { label: 'All videos', value: 0 },
                        { label: 'My Videos', value: 1 }
                    ]}
                    onSelect={setSearchTarget}
                />
            </nav>
        </div>
    );
};

export default SearchHeader;
