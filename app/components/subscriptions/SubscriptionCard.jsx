import { Link } from 'react-router'

const { connect } = ReactRedux

const SubscriptionCard = ({ id, title, itemCount, dispatch }) => {
  return (
    <div className='card shadow--2dp'>
      <Link className='card__text' to={'/channel/' + id}>
        <div>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>

      <button
        className='card__button icon-button'
        type='button'
        onClick={() => {
          dispatch({
            type: 'PROMPT_UNSUBSCRIBE',
            data: { title },
            callback: () => {
              dispatch({
                type: 'UNSUBSCRIBE',
                data: { id }
              })
              dispatch({ type: 'PROMPT_CLOSE' })
            } 
          })
        }}
      >
        <span className='icon'>
          <svg><use xlinkHref='#icon-close'></use></svg>
        </span>
      </button>
    </div>
  )
}

export default connect()(SubscriptionCard)
