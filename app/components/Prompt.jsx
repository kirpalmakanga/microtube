import { getVideo } from '../actions/database'
const { connect } = ReactRedux

const Prompt = ({ auth, prompt, dispatch }) => {
  const {form, isVisible, promptText, confirmText, cancelText, callback } = prompt

  function close(e) {
    if(e) {
        e.stopPropagation()
    }

    dispatch({ type: 'PROMPT_CLOSE' })
    setTimeout(() => dispatch({ type: 'PROMPT_RESET' }), 300)
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
              />
            </div>
            <div className='dialog__actions'>
              <button className='button button--close' onClick={close}>{cancelText}</button>
              <button type='submit' className='button'>{confirmText}</button>
            </div>
          </form>
        ) : (
          <div className='dialog__actions'>
            <button className='button button--close' onClick={close}>{cancelText}</button>
            <button className='button' onClick={callback}>{confirmText}</button>
          </div>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, prompt }) => ({ auth, prompt })

export default connect(mapStateToProps)(Prompt)
