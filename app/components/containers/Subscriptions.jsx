import { h, Component } from 'preact'
import { connect } from 'preact-redux'
import Waypoint from 'preact-waypoint'

import { getSubscriptions } from '../../actions/youtube'
import SubscriptionCard from '../cards/SubscriptionCard'

class Subscriptions extends Component {
  componentDidMount = this.forceUpdate

  componentWillDestroy = () => this.props.dispatch({ type: 'CLEAR_SUBSCRIPTIONS' })

  loadMoreContent = () => {
    const { auth, subscriptions, dispatch } = this.props
    const nextPage = subscriptions.pages[subscriptions.pages.length - 1]

    if (auth.token && subscriptions.isLoading !== 2) {
      this.props.dispatch(getSubscriptions(auth.token, nextPage))
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
          {this.base ? (<Waypoint container={this.base} onEnter={this.loadMoreContent} />) : null}
          <svg class='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ auth, subscriptions }) => ({ auth, subscriptions })

export default connect(mapStateToProps)(Subscriptions)
