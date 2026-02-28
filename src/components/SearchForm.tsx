import { Component, createSignal, JSX, onMount } from 'solid-js';
import { preventDefault, stopPropagation } from '../lib/helpers';
interface Props {
    query?: string;
    onSubmit: (query: string) => void;
}

const SearchForm: Component<Props> = (props) => {
    const [input, setInput] = createSignal(props.query || '');
    let inputRef = undefined as HTMLInputElement | undefined;

    const handleInput: JSX.EventHandler<HTMLInputElement, Event> = ({ currentTarget: { value } }) =>
        setInput(value);

    const handleSubmit = preventDefault(() => {
        const newQuery = input().trim();

        if (newQuery && newQuery !== props.query) props.onSubmit(newQuery);
    });

    onMount(() => {
        if (inputRef) inputRef.focus();
    });

    return (
        <form class="flex flex-grow" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                class="h-8 px-2 flex-grow transition-colors bg-primary-800 hover:bg-primary-700 focus:(outline-none bg-primary-600) placeholder-100 placeholder-opacity-50 rounded-l"
                value={input()}
                type="text"
                placeholder="Search..."
                onKeyPress={stopPropagation()}
                onChange={handleInput}
            />
        </form>
    );
};

export default SearchForm;
