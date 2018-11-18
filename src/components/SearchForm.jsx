import React, { Component } from 'react';
import { connect } from 'react-redux';

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
  }

  getInputRef = (el) => (this.input = el);

  handleInput = ({ target: { value } }) =>
    this.setState({ input: value.trim() });

  handleFocus = (e) => {
    e.preventDefault();
    e.target.parentNode.classList.add('is-focused');
  };

  handleBlur = (e) => {
    e.preventDefault();
    e.target.parentNode.classList.remove('is-focused');
  };

  handleSubmit = (e) => {
    const { input } = this.state;

    e.preventDefault();

    input && this.props.onSubmit(input);
  };

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
      <form className='search-form' onSubmit={handleSubmit}>
        <div className='textfield'>
          <label className='sr-only' labelfor='search'>
            Search
          </label>
          <input
            ref={getInputRef}
            value={input}
            name='search'
            className='textfield__input'
            id='search'
            type='text'
            placeholder='Search...'
            onChange={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </form>
    );
  }
}

export default connect()(Form);
