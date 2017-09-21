import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'
import VideoCard from '../cards/VideoCard.jsx'

import { getChannelVideos } from '../../actions/database'

class Channel extends Component {
  loadMoreContent = () => {
    const { auth, channel, id, dispatch } = this.props
    const nextPage = channel.pages[channel.pages.length - 1] || ''

    dispatch(getChannelVideos(auth.token, id, nextPage))
  }

  renderWaypoint = () => {
    const { auth, channel } = this.props

    if (auth.token && channel.isLoading !== 2) {
      return (<Waypoint onEnter={this.loadMoreContent} topOffset={1} />)
    }
  }

  render ({ auth, channel }) {
    return (
      <div className='grid'>
        {channel.items.map((data, i) => (
          <div key={i} className='grid__item'>
            <VideoCard {...data} />
          </div>
        ))}

        <div className={['grid__loading', auth.token && channel.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {this.renderWaypoint()}
          <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ auth, channel }) => ({ auth, channel })

export default connect(mapStateToProps)(Channel)
