import { createSignal, onMount, Component } from 'solid-js';
import { HTMLElementEvent } from '../../@types/alltypes';
import { preventDefault, stopPropagation } from '../lib/helpers';
interface Props {
    query?: string;
    onSubmit: (query: string) => void;
}

const SearchForm: Component<Props> = ({ query = '', onSubmit }) => {
    const [input, setInput] = createSignal(query);
    let inputRef: HTMLInputElement;

    onMount(() => {
        setInput(query);

        inputRef?.focus();
    });

    const handleInput = ({
        currentTarget: { value }
    }: HTMLElementEvent<HTMLInputElement>) => setInput(value);

    const handleSubmit = preventDefault(() => {
        const newQuery = input().trim();

        if (newQuery && newQuery !== query) {
            onSubmit(newQuery);
        }
    });

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="textfield">
                <label className="sr-only" htmlFor="search">
                    Search
                </label>

                <input
                    aria-label="Search"
                    value={input()}
                    name="search"
                    className="textfield__input"
                    id="search"
                    type="text"
                    placeholder="Search..."
                    onKeyPress={stopPropagation()}
                    onChange={handleInput}
                />
            </div>
        </form>
    );
};

export default SearchForm;
