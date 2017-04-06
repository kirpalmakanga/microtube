import { Link } from 'react-router'
import { unsubscribe } from '../../actions/database'

const { connect } = ReactRedux

const SubscriptionCard = ({ id, channelId, title, itemCount, dispatch }) => {
  return (
    <div className='card shadow--2dp'>
      <Link className='card__content' to={'/channel/' + channelId}>
        <div className='card__text'>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>
    </div>
  )
}

const mapStateToProps = ({ auth, subscriptions }) => ({ auth, subscriptions })

export default connect(mapStateToProps)(SubscriptionCard)
