import { h, Component } from 'preact'
import { connect } from 'preact-redux'

import Waypoint from 'preact-waypoint'

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

  render({ auth, playlists }) {
    return (
      <div class='grid'>
        {playlists.items.map((data, i) => (
          <div key={i} class='grid__item'>
            <PlaylistCard {...data} />
          </div>
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
