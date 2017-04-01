const { connect } = ReactRedux

const Notifications = ({ notifications, dispatch }) => {
  const close = ({ target }) => {
    const notification = target.parentNode

    notification.classList.remove(notifications.className)

    notification.addEventListener('transitionend', () => {
      target.removeEventListener('transitionend', close)

      dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    })
  }

  return (
    <div className={['notification', notifications.className || ''].join(' ')}>
      <div className='notification__content'>
        <div className='notification__text'>{notifications.message || ''}</div>
        <button className='notification__action icon-button' onClick={close} >
          <span className='icon'>
            <svg><use xlinkHref='#icon-close'></use></svg>
          </span>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ notifications }) => ({ notifications })

export default connect(mapStateToProps)(Notifications)
