import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Waypoint from 'preact-waypoint'

import { getSubscriptions } from '../../actions/database'
import SubscriptionCard from '../cards/SubscriptionCard.jsx'

class Subscriptions extends Component {

  loadMoreContent = () => {
    const { auth, subscriptions, dispatch } = this.props
    const nextPage = subscriptions.pages[subscriptions.pages.length - 1]

    this.props.dispatch(getSubscriptions(auth.token))
  }

  renderWaypoint = () => {
    const { auth, subscriptions } = this.props

    if (auth.token && subscriptions.isLoading !== 2) {
      return (<Waypoint onEnter={this.loadMoreContent} topOffset={1} />)
    }
  }

  render ({ auth, subscriptions }) {
    return (
      <div class='grid channels'>
        {subscriptions.items.map((data, i) => (
          <div key={i} class='grid__item'>
            <SubscriptionCard {...data} />
          </div>
        ))}

        <div class={['grid__loading', auth.token && subscriptions.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {this.renderWaypoint()}
          <svg class='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ auth, subscriptions }) => ({ auth, subscriptions })

export default connect(mapStateToProps)(Subscriptions)
