import Waypoint from 'react-waypoint'
import { Link } from 'react-router'

import VideoCard from '../cards/VideoCard.jsx'

import { getPlaylistTitle, getPlaylistItems } from '../../actions/database'

const { connect } = ReactRedux

class Playlist extends React.Component {
  componentWillMount() {
    const { dispatch, auth, params } = this.props

    dispatch(getPlaylistTitle(auth.token, params.id))
  }

  loadMoreContent = () => {
    const { dispatch, auth, params, playlistItems } = this.props
    const nextPage = playlistItems.pages[playlistItems.pages.length - 1]

    dispatch(getPlaylistItems(auth.token, params.id, nextPage))
  }

  renderWaypoint = () => {
    const { auth, playlistItems } = this.props

    if (auth.token && playlistItems.isLoading !== 2) {
      return (<Waypoint onEnter={this.loadMoreContent} topOffset={1} />)
    }
  }

  render() {
    const { props, renderWaypoint } = this
    const { auth, playlistItems, dispatch } = props

    return (
      <div className='grid'>
        {playlistItems.items.map((video, i) => (
          <div key={i} className='grid__item'>
            <VideoCard video={video} />
          </div>
        ))}

        <div className={['grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
          {renderWaypoint()}
          <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(Playlist)
