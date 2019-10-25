import React, { Component } from 'react';

import { stopPropagation, preventDefault } from '../lib/helpers';

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = { input: props.query };
    }

    componentDidUpdate({ query: prevQuery }) {
        const { query } = this.props;

        prevQuery !== query && this.setState({ input: query });
    }

    componentDidMount() {
        this.input.focus();

        this.__keyDownHandler = stopPropagation();
        this.input.addEventListener('keydown', this.__keyDownHandler);
    }

    componentWillUnmount() {
        this.input.removeEventListener('keydown', this.__keyDownHandler);
    }

    getInputRef = (el) => (this.input = el);

    handleInput = ({ target: { value: input } }) => this.setState({ input });

    handleFocus = preventDefault(({ target: { parentNode } }) => {
        parentNode.classList.add('is-focused');
    });

    handleBlur = preventDefault(({ target: { parentNode } }) => {
        parentNode.classList.remove('is-focused');
    });

    handleSubmit = preventDefault(() => {
        const {
            state: { input },
            props: { query }
        } = this;

        const newQuery = input.trim();

        newQuery && newQuery !== query && this.props.onSubmit(newQuery);
    });

    render() {
        const {
            state: { input },
            getInputRef,
            handleInput,
            handleFocus,
            handleBlur,
            handleSubmit
        } = this;

        return (
            <form className="search-form" onSubmit={handleSubmit}>
                <div className="textfield">
                    <label className="sr-only" labelfor="search">
                        Search
                    </label>

                    <input
                        aria-label="Search"
                        ref={getInputRef}
                        value={input}
                        name="search"
                        className="textfield__input"
                        id="search"
                        type="text"
                        placeholder="Search..."
                        onChange={handleInput}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                </div>
            </form>
        );
    }
}

export default Form;
