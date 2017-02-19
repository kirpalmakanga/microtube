// jshint esversion: 6, asi: true
// eslint-env es6

const { connect } = ReactRedux

const Notifications = ({ notifications }) => {
  const close = ({ target }) => {
    const notification = target.parentNode

    notification.classList.remove(notifications.className)

    notification.addEventListener('transitionend', () => {
      notification.removeEventListener('transitionend', close)

      dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    })
  }

  return (
    <div className={'mdl-snackbar ' + notifications.className}>
      <div className='mdl-snackbar__text'>{notifications.message || ''}</div>
      <button className='mdl-snackbar__action' onClick={close} >Fermer</button>
    </div>
  )
}

const mapStateToProps = ({ notifications }) => ({ notifications })

export default connect(mapStateToProps)(Notifications)
