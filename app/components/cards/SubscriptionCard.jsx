import { h } from 'preact'
import { Link } from 'preact-router'
import { connect } from 'preact-redux'

import { unsubscribe } from '../../actions/youtube'

const SubscriptionCard = ({ id, channelId, title, itemCount, dispatch }) => {
  return (
    <div className='card shadow--2dp'>
      <Link className='card__content' href={'/channel/' + channelId} aria-label={`Open channel ${title}`}>
        <div className='card__text'>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>
    </div>
  )
}

export default connect()(SubscriptionCard)
