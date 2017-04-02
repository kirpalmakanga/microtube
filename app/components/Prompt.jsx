import { getVideo } from '../actions/database'
const { connect } = ReactRedux

const Prompt = ({ auth, prompt, dispatch }) => {
  const {form, isVisible, promptText, confirmText, cancelText, callback } = prompt

  function close(e) {
    e.stopPropagation()
    dispatch({ type: 'PROMPT_CLOSE' })
  }

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
    close()
  }

  return (
    <div
      className={['dialog__overlay', isVisible ? 'dialog__overlay--show': ''].join(' ')}
      onClick={close}
    >
      <div
        className='dialog shadow--2dp'
        onClick={e => e.stopPropagation()}
      >
        <div className='dialog__content'>
          <p>{promptText}</p>
        </div>
        {form ? (
          <form onSubmit={handleSubmit}>
            <div className='textfield' >
              <input
                className='textfield__input'
                type='text'
                autoFocus
                placeholder='URL/ID...'
                id='videoId'
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>
          </form>
        ) : null}
        <div className='dialog__actions'>
          <button className='button button--close' onClick={close}>{cancelText}</button>
          {form ? (
            <button type='submit' className='button'>{confirmText}</button>
          ) : (
            <button className='button' onClick={callback}>{confirmText}</button>
          )}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, prompt }) => ({ auth, prompt })

export default connect(mapStateToProps)(Prompt)
