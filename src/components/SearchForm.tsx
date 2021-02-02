import {
    useState,
    useEffect,
    useRef,
    useCallback,
    FunctionComponent
} from 'react';

import { stopPropagation, preventDefault } from '../lib/helpers';

interface Props {
    query: string;
    onSubmit: (query: string) => void;
}

const SearchForm: FunctionComponent<Props> = ({ query, onSubmit }) => {
    const [input, setInput] = useState(query);
    const inputRef = useRef<HTMLInputElement>(null);

    const keyDownHandler = stopPropagation();

    const unlistenKeyDown = () => {
        inputRef.current &&
            inputRef.current.removeEventListener('keydown', keyDownHandler);
    };

    const listenKeyDown = () => {
        unlistenKeyDown();

        inputRef.current?.addEventListener('keydown', keyDownHandler);
    };

    useEffect(() => {
        setInput(query);

        inputRef.current?.focus();

        listenKeyDown();

        return unlistenKeyDown;
    }, [query]);

    const handleInput = useCallback(
        ({ target: { value } }) => setInput(value),
        []
    );

    const handleSubmit = useCallback(
        preventDefault(() => {
            const newQuery = input.trim();

            if (newQuery && newQuery !== query) {
                onSubmit(newQuery);
            }
        }),
        []
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
