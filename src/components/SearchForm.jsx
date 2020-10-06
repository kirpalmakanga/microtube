import { useState, useEffect, useRef } from 'react';

import { stopPropagation, preventDefault } from '../lib/helpers';

const SearchForm = ({ query, onSubmit }) => {
    const [input, setInput] = useState(query);
    const inputRef = useRef(null);

    const keyDownHandler = stopPropagation();

    const unlistenKeyDown = () =>
        inputRef.current.removeEventListener('keydown', keyDownHandler);

    const listenKeyDown = () => {
        unlistenKeyDown();
        inputRef.current.addEventListener('keydown', keyDownHandler);
    };
    useEffect(() => {
        setInput(query);

        inputRef.current.focus();

        listenKeyDown();

        return unlistenKeyDown;
    }, [query]);

    const handleInput = ({ target: { value } }) => setInput(value);

    const handleSubmit = preventDefault(() => {
        const newQuery = input.trim();

        if (newQuery && newQuery !== query) {
            onSubmit(newQuery);
        }
    });

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <div className="textfield">
                <label className="sr-only" labelfor="search">
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
