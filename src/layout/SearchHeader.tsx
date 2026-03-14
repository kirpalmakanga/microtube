import { A, useSearchParams } from '@solidjs/router';
import DropDown, { DropDownOption } from '../components/ui/DropDown';
import Icon from '../components/ui/Icon';
import Title from '../components/meta/Title';
import SearchForm from '../components/SearchForm';
import { useAppTitle } from '../store/app';
import { useSearch } from '../store/search';

const searchModeOptions: DropDownOption<0 | 1>[] = [
    { label: 'All videos', value: 0 },
    { label: 'My Videos', value: 1 }
];

const SearchHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, { setSearchTarget }] = useSearch();
    const title = useAppTitle();

    const handleFormSubmit = (query: string) => setSearchParams({ query }, { replace: true });

    return (
        <div class="flex flex-grow items-center px-4">
            <Title>{title()}</Title>

            <A
                class="relative flex items-center justify-center h-12 w-12 -ml-4 transition-colors bg-primary-900 hover:bg-primary-800"
                href="/"
            >
                <Icon class="text-light-50 w-6 h-6" name="arrow-left" />
            </A>

            <SearchForm query={(searchParams.query as string) || ''} onSubmit={handleFormSubmit} />

            <DropDown
                buttonClass="rounded-l-none"
                currentValue={search.forMine}
                options={searchModeOptions}
                onSelect={setSearchTarget}
            />
        </div>
    );
};

export default SearchHeader;
