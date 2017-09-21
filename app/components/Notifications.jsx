import { h, Component } from 'preact'
import { connect } from 'preact-redux'

class Notifications extends Component {
  constructor(props) {
    super(props)

    this.state = { show: false }
  }

  componentDidMount = () => {
    this.setState({ show: true })
    setTimeout(this.close, 3000)
  }

  close = () => {
    const { container } = this
    const { notifications, dispatch } = this.props

    const handler = () => {
      container.removeEventListener('transitionend', handler)

      dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    }

    this.setState({ show: false })

    container.addEventListener('transitionend', handler)
  }

  render({ notifications, dispatch }, { show }) {
    const { close } = this
    return (
      <div class={['notification', show ? 'notification--active' : ''].join(' ')} ref={(el) => this.container = el}>
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
