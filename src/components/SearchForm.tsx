import { Component, createSignal, JSX, onMount } from 'solid-js';
import { preventDefault, stopPropagation } from '../lib/helpers';
interface Props {
    query?: string;
    onSubmit: (query: string) => void;
}

const SearchForm: Component<Props> = (props) => {
    const [input, setInput] = createSignal(props.query || '');
    let inputRef: HTMLDivElement | undefined = undefined;

    onMount(() => inputRef?.focus());

    const handleInput: JSX.EventHandler<HTMLInputElement, Event> = ({
        currentTarget: { value }
    }) => setInput(value);

    const handleSubmit = preventDefault(() => {
        const newQuery = input().trim();

        if (newQuery && newQuery !== props.query) props.onSubmit(newQuery);
    });

    return (
        <form class="search-form" onSubmit={handleSubmit}>
            <div class="textfield">
                <label class="sr-only" htmlFor="search">
                    Search
                </label>

                <input
                    ref={inputRef}
                    aria-label="Search"
                    value={input()}
                    name="search"
                    class="textfield__input"
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
