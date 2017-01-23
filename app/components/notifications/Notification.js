// jshint esversion: 6, asi: true
// eslint-env es6



const { connect } = ReactRedux

const Notification = ({ className, message, url, dispatch }) => {

  const close = ({ target }) => {
    const notification = target.parentNode

    notification.classList.remove(className)

    notification.addEventListener('transitionend', () => {
      notification.removeEventListener('transitionend', close)

      dispatch({ type: 'CLEAR_NOTIFICATIONS' })
    })
  }

  return (
    <div className={'mdl-snackbar ' + className}>
      <div className='mdl-snackbar__text'>{message || ''}</div>
      <button
        className='mdl-snackbar__action'
        type='button'
        onClick={close}
      >Fermer</button>
    </div>
  )
}

const mapStateToProps = ({ notifications }) => ({ notifications })

export default connect(mapStateToProps)(Notification)
