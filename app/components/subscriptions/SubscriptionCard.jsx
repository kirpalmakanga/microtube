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
    </div>
  )
}

export default connect()(SubscriptionCard)
