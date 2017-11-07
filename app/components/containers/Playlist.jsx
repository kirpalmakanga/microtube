import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VideoCard from '../cards/VideoCard'

import { getPlaylistItems } from '../../actions/youtube'

class Playlist extends Component {
  componentDidMount = this.forceUpdate

  componentWillUnmount = () => this.props.dispatch({ type: 'CLEAR_PLAYLIST_ITEMS' })

  loadMoreContent = () => {
    const { dispatch, auth, id, playlistItems } = this.props
    const nextPage = playlistItems.pages[playlistItems.pages.length - 1]

    if (auth.token && playlistItems.isLoading !== 2) {
      dispatch(getPlaylistItems(auth.token, id, nextPage))
    }
  }

  renderWaypoint() {
    return this.base ? (<Waypoint container={this.base} onEnter={this.loadMoreContent} />) : null
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
