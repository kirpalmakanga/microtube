import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class Notifications extends Component {
  close = () => {
    const { container } = this
    const { notifications, dispatch } = this.props

    const handler = () => {
      container.removeEventListener('transitionend', handler)

      dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    }

    container.classList.remove(notifications.className)

    container.addEventListener('transitionend', handler)
  }

  render({ notifications, dispatch }) {
    const { close } = this
    return (
      <div class={['notification', notifications.className || ''].join(' ')} ref={(el) => this.container = el}>
        <div class='notification__content'>
          <div class='notification__text'>{notifications.message || ''}</div>
          <button class='notification__action icon-button' onClick={close} >
            <span class='icon'>
              <svg><use xlinkHref='#icon-close'></use></svg>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ notifications }) => ({ notifications })

export default connect(mapStateToProps)(Notifications)
