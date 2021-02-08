import {
    useState,
    useEffect,
    useRef,
    useCallback,
    FunctionComponent
} from 'react';

import { preventDefault } from '../lib/helpers';
interface Props {
    query?: string;
    onSubmit: (query: string) => void;
}

const SearchForm: FunctionComponent<Props> = ({ query = '', onSubmit }) => {
    const [input, setInput] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    const keyDownHandler = useCallback(
        (e: KeyboardEvent) => e.stopPropagation(),
        []
    );

    const unlistenKeyDown = useCallback(() => {
        inputRef.current?.removeEventListener('keyup', keyDownHandler);
    }, []);

    const listenKeyDown = useCallback(() => {
        unlistenKeyDown();

        inputRef.current?.addEventListener('keyup', keyDownHandler);
    }, []);

    useEffect(() => {
        setInput(query);

        inputRef.current?.focus();

        listenKeyDown();

        return unlistenKeyDown;
    }, [query]);

    const handleInput = useCallback(
        ({ currentTarget: { value } }) => setInput(value),
        []
    );

    const handleSubmit = useCallback(
        preventDefault(() => {
            const newQuery = input.trim();

            if (newQuery && newQuery !== query) {
                onSubmit(newQuery);
            }
        }),
        [input]
    );

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="textfield">
                <label className="sr-only" htmlFor="search">
                    Search
                </label>

                <input
                    aria-label="Search"
                    ref={inputRef}
                    value={input}
                    name="search"
                    className="textfield__input"
                    id="search"
                    type="text"
                    placeholder="Search..."
                    onChange={handleInput}
                />
            </div>
        </form>
    );
};

export default SearchForm;
