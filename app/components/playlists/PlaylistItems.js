// jshint esversion: 6, asi: true
// eslint-env es6



import { getPlaylistItems } from '../../actions/database'
import VideoCard from './VideoCard'
import Waypoint from 'react-waypoint'
const { connect } = ReactRedux

const PlaylistItems = ({ auth, playlistItems, dispatch }) => {
  const playlistId = playlistItems.playlistId
  const nextPage = playlistItems.pages[playlistItems.pages.length - 1] || ''

  return (
    <div className={['playlist-items', playlistItems.isOpen ? 'playlist-items--show': ''].join(' ')}>
      <div className='mdl-grid'>
        {playlistItems.items.map((video, i) => (
          <div key={i} className='mdl-cell mdl-cell--12-col-phone mdl-cell--12-col-tablet mdl-cell--12-col'>
            <VideoCard video={video} />
          </div>
        ))}

        <div className={['mdl-grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
          <svg className='loading'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(PlaylistItems)
