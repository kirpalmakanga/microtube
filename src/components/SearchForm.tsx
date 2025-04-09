import { Component, createSignal, JSX, onMount } from 'solid-js';
import { preventDefault, stopPropagation } from '../lib/helpers';
interface Props {
    query?: string;
    onSubmit: (query: string) => void;
}

const SearchForm: Component<Props> = (props) => {
    const [input, setInput] = createSignal(props.query || '');
    let inputRef: HTMLDivElement | undefined = undefined;

    const handleInput: JSX.EventHandler<HTMLInputElement, Event> = ({
        currentTarget: { value }
    }) => setInput(value);

    const handleSubmit = preventDefault(() => {
        const newQuery = input().trim();

        if (newQuery && newQuery !== props.query) props.onSubmit(newQuery);
    });

    onMount(() => inputRef?.focus());

    return (
        <form class="flex flex-grow" onSubmit={handleSubmit}>
            <input
                ref={inputRef}
                class="h-12 px-4 flex-grow transition-colors bg-primary-600 focus:(outline-none bg-primary-500) text-100 placeholder-100 placeholder-opacity-50 caret-white caret-opacity-50"
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
