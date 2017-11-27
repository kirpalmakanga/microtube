import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

import VisibilitySensor from '../VisibilitySensor'

import PlaylistCard from '../cards/PlaylistCard'

import { getPlaylists } from '../../actions/youtube'

class Playlists extends Component {
  componentDidMount() {
    this.forceUpdate()
  }

  loadMoreContent = () => {
    const { auth, playlists, dispatch } = this.props
    const nextPage = playlists.pages[playlists.pages.length - 1]

    if (auth.token && playlists.isLoading !== 2) {
      dispatch(getPlaylists(auth.token, nextPage))
    }
  }

  renderWaypoint() {
    return this.base ? (<Waypoint container={this.base} onEnter={this.loadMoreContent} />) : null
  }

  // <div key={i} class='grid__item'>
  // <PlaylistCard {...data} />
  // </div>

  render({ auth, playlists }) {
    return (
      <div class='grid'>
        {playlists.items.map((data, i) => (
          <VisibilitySensor
            key={i}
            className='grid__item'
            partialVisibility={true}
            scrollCheck={true}
            scrollThrottle={200}
            containment={this.base}
          >
            {({ isVisible, visibilityRect }) => (
                isVisible ? (<PlaylistCard {...data} />) : null
            )}
          </VisibilitySensor>
        ))}

        <div class={['grid__loading', auth.token && playlists.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {this.renderWaypoint()}
          <svg class='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, playlists }) => ({ auth, playlists })

export default connect(mapStateToProps)(Playlists)
