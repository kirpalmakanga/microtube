import { A, useSearchParams } from '@solidjs/router';
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
        <div class="flex flex-grow items-center px-4">
            <Title>{title()}</Title>

            <A
                class="relative flex items-center justify-center h-12 w-12 -ml-4 transition-colors bg-primary-900 hover:bg-primary-800"
                href="/"
            >
                <Icon class="text-light-50 w-6 h-6" name="arrow-left" />
            </A>

            <SearchForm
                query={searchParams.query || ''}
                onSubmit={handleFormSubmit}
            />

            <nav class="-mr-4">
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
