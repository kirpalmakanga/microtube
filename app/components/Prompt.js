// jshint esversion: 6, asi: true
// eslint-env es6

const { connect } = ReactRedux

import { getVideo } from '../actions/database'

const Prompt = ({ auth, prompt, dispatch }) => {
  const {form, isVisible, promptText, confirmText, cancelText, callback } = prompt

  function handleFocus(e) {
    e.preventDefault()
    e.target.parentNode.classList.add('is-focused')
  }

  function handleBlur(e) {
    e.preventDefault()
    e.target.parentNode.classList.remove('is-focused')
  }

  function handleSubmit(e) {
    const videoId = e.target.querySelector('#videoId').value
    e.preventDefault()

    dispatch(getVideo(auth.token, videoId))
    dispatch({ type: 'PROMPT_CLOSE' })
  }

  return (
    <dialog className='mdl-dialog' open={isVisible ? true : false}>
      <div className='mdl-dialog__content'>
        <p>{promptText}</p>
      </div>
      {form ? (
        <form onSubmit={handleSubmit}>
          <div className='mdl-textfield' >
            <input
              className='mdl-textfield__input'
              type='text'
              autoFocus
              placeholder='URL/ID...'
              id='videoId'
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>
          <div className='mdl-dialog__actions'>
            <button type='submit' className='mdl-button'>{confirmText}</button>
            <button type='button' className='mdl-button close' onClick={() => dispatch({ type: 'PROMPT_CLOSE' })}>{cancelText}</button>
          </div>
        </form>
      ) : (
        <div className='mdl-dialog__actions'>
          <button type='button' className='mdl-button' onClick={callback}>{confirmText}</button>
          <button type='button' className='mdl-button close' onClick={() => dispatch({ type: 'PROMPT_CLOSE' })}>{cancelText}</button>
        </div>
      )}
    </dialog>
  )
}

const mapStateToProps = ({ auth, prompt }) => ({ auth, prompt })

export default connect(mapStateToProps)(Prompt)
