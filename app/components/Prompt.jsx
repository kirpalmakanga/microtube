import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import { queueVideo } from '../actions/youtube'


class Prompt extends Component {

  close = (e) => {
    const { dispatch } = this.props

    if(e) {
        e.stopPropagation()
    }

    dispatch({ type: 'PROMPT_CLOSE' })
    setTimeout(() => dispatch({ type: 'PROMPT_RESET' }), 250)
  }

  handleSubmit = (e) => {
    const videoId = e.target.querySelector('input').value

    e.preventDefault()

    this.props.dispatch(queueVideo(videoId))
    this.close()
  }

  render({ auth, prompt, dispatch }) {
    const {close, handleSubmit} = this
    const {form, isVisible, promptText, confirmText, cancelText, callback } = prompt
    return (
      <div
        class={['dialog__overlay', isVisible ? 'dialog__overlay--show': ''].join(' ')}
        onClick={close}
      >
        <div
          class='dialog shadow--2dp'
          onClick={e => e.stopPropagation()}
        >
          <div class='dialog__content'>
            <p>{promptText}</p>
          </div>
          {form ? (
            <form onSubmit={handleSubmit}>
              <div class='textfield' >
                <label for='videoId'>Video URL or ID</label>
                <input
                  id='videoId'
                  class='textfield__input'
                  type='text'
                  autoFocus
                  placeholder='URL/ID...'
                />
              </div>
              <div class='dialog__actions'>
                <button class='button button--close' onClick={close}>{cancelText}</button>
                <button type='submit' class='button'>{confirmText}</button>
              </div>
            </form>
          ) : (
            <div class='dialog__actions'>
              <button class='button button--close' onClick={close}>{cancelText}</button>
              <button class='button' onClick={callback}>{confirmText}</button>
            </div>
          )}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ prompt }) => ({ prompt })

export default connect(mapStateToProps)(Prompt)
