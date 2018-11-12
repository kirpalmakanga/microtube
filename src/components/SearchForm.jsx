import React, { Component } from 'react';
import { connect } from 'react-redux';

class Form extends Component {
  state = { input: '' };

  componentDidMount() {
    this.input.focus();
  }

  handleInput = (input) => this.setState({ input: input.trim() });

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
      handleInput,
      handleFocus,
      handleBlur,
      handleSubmit
    } = this;

    return (
      <form class='search-form' onSubmit={handleSubmit}>
        <div class='textfield'>
          <label class='sr-only' for='search'>
            Search
          </label>
          <input
            value={input}
            name='search'
            class='textfield__input'
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
