import React, { Component } from 'react';
import { connect } from 'react-redux';
import { queueVideos } from '../actions/youtube';

import Button from './Button';

import { parseID } from '../lib/helpers';

class Prompt extends Component {
  state = {
    data: {}
  };

  close = (e) => {
    const { dispatch } = this.props;

    if (e) {
      e.stopPropagation();
    }

    dispatch({ type: 'PROMPT_CLOSE' });
    setTimeout(() => dispatch({ type: 'PROMPT_RESET' }), 250);
  };

  handleChange = ({ target: { name, value } }) =>
    this.setState(({ data }) => ({ data: { ...data, name, value } }));

  handleSubmit = (e) => {
    const urls = e.target.querySelector('textarea').value.match(/[^\r\n]+/g);

    const ids = urls.map(parseID);
    e.preventDefault();

    this.props.dispatch(queueVideos(ids));
    this.close();
  };

  render() {
    const {
      props: { prompt },
      close,
      handleChange,
      handleSubmit
    } = this;
    const {
      form,
      isVisible,
      promptText,
      confirmText,
      cancelText,
      callback
    } = prompt;
    return (
      <div
        className={[
          'dialog__overlay',
          isVisible ? 'dialog__overlay--show' : ''
        ].join(' ')}
        onClick={close}
      >
        <div
          className='dialog shadow--2dp'
          onClick={(e) => e.stopPropagation()}
        >
          <div className='dialog__content'>
            <p>{promptText}</p>
          </div>
          {form ? (
            <form onSubmit={handleSubmit}>
              <div className='textfield'>
                <label labelfor='videoId'>Video URLs or IDs</label>
                <textarea
                  id='videoId'
                  className='textfield__input'
                  type='text'
                  name='ids'
                  onChange={handleChange}
                  autoFocus
                  placeholder='URLs/IDs...'
                />
              </div>
              <div className='dialog__actions'>
                <Button
                  className='button button--close shadow--2dp'
                  onClick={close}
                  title={cancelText}
                />

                <Button
                  type='submit'
                  className='button shadow--2dp'
                  title={confirmText}
                />
              </div>
            </form>
          ) : (
            <div className='dialog__actions'>
              <Button
                className='button button--close shadow--2dp'
                onClick={close}
                title={cancelText}
              />

              <Button
                className='button shadow--2dp'
                onClick={callback}
                title={confirmText}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ prompt }) => ({ prompt });

export default connect(mapStateToProps)(Prompt);
