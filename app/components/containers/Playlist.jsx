import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VideoCard from '../cards/VideoCard.jsx'

import { getPlaylistTitle, getPlaylistItems } from '../../actions/database'

class Playlist extends Component {
  componentWillMount() {
    const { dispatch, auth, id } = this.props
    
    dispatch(getPlaylistTitle(auth.token, id))
  }

  loadMoreContent = () => {
    const { dispatch, auth, id, playlistItems } = this.props
    const nextPage = playlistItems.pages[playlistItems.pages.length - 1]

    dispatch(getPlaylistItems(auth.token, id, nextPage))
  }

  renderWaypoint = () => {
    const { auth, playlistItems } = this.props

    if (auth.token && playlistItems.isLoading !== 2) {
      return (<Waypoint onEnter={this.loadMoreContent} topOffset={1} />)
    }
  }

  render({ auth, playlistItems, dispatch }) {
    return (
      <div class='grid'>
        {playlistItems.items.map((data, i) => (
          <div key={i} class='grid__item'>
            <VideoCard {...data} />
          </div>
        ))}

        <div class={['grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {this.renderWaypoint()}
          <svg class='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(Playlist)
