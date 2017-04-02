import { getSubscriptions } from '../../actions/database'
import SubscriptionCard from './SubscriptionCard.jsx'
import Waypoint from 'react-waypoint'
const { connect } = ReactRedux

const Subscriptions = ({ auth, subscriptions, dispatch }) => {
  function loadMoreContent () {
    dispatch(getSubscriptions(auth.token))
  }

  function renderWaypoint() {
    if (auth.token && subscriptions.isLoading !== 2) {
      return (<Waypoint onEnter={loadMoreContent} topOffset={1} />)
    }
  }
  return (
    <div className='grid channels'>
      {subscriptions.items.map((data, i) => (
        <div key={i} className='grid__item'>
          <SubscriptionCard {...data} />
        </div>
      ))}

      <div className={['grid__loading', auth.token && subscriptions.isLoading === 1 ? 'is-active': ''].join(' ')}>
        <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
      </div>

      {renderWaypoint()}
    </div>
  )
}


const mapStateToProps = ({ auth, subscriptions }) => ({ auth, subscriptions })

export default connect(mapStateToProps)(Subscriptions)
