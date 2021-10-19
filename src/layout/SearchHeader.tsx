import { Link, useNavigate, useParams } from 'solid-app-router';
import { Title } from 'solid-meta';

import useAppTitle from '../store/hooks/app-title';
import { useSearch } from '../store/hooks/search';

import SearchForm from '../components/SearchForm';
import Icon from '../components/Icon';
import DropDown from '../components/DropDown';

const SearchHeader = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [search, { setSearchTarget }] = useSearch();
    const title = useAppTitle();

    const handleFormSubmit = (query: string) =>
        navigate(`/search/${query}`, { replace: true });

    return (
        <div className="layout__header-row">
            <Title>{title}</Title>

            <Link
                className="layout__back-button icon-button"
                href="/"
                aria-label="Close search"
            >
                <Icon name="arrow-left" />
            </Link>

            <SearchForm
                query={decodeURIComponent(params.query || '')}
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
