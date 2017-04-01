import Waypoint from 'react-waypoint'
import { Link } from 'react-router'
import VideoCard from './VideoCard.jsx'
import { getPlaylistItems } from '../../actions/database'

const { connect } = ReactRedux

const PlaylistItems = ({ auth, playlistItems, params, dispatch }) => {
  function loadMoreContent () {
    dispatch(getPlaylistItems(auth.token, params.id))
  }

  function renderWaypoint() {
    if (auth.token && playlistItems.isLoading !== 2) {
      return (<Waypoint onEnter={loadMoreContent} topOffset={1} />)
    }
  }

  console.log('playlistItems', playlistItems)

  return (
    <div className='grid'>
      {playlistItems.items.map((video, i) => (
        <div key={i} className='grid__item'>
          <VideoCard video={video} />
        </div>
      ))}

      <div className={['grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
        <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
      </div>

      {renderWaypoint()}
    </div>
  )
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(PlaylistItems)
