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
    <div className={['playlist-items shadow--2dp', playlistItems.isOpen ? 'playlist-items--show': ''].join(' ')}>
      <div className='grid'>
        {playlistItems.items.map((video, i) => (
          <div key={i} className='grid__item'>
            <VideoCard video={video} />
          </div>
        ))}

        <div className={['grid__loading', playlistItems.isLoading === 1 ? 'is-active': ''].join(' ')}>
          <svg className='rotating'><use xlinkHref='#icon-loading'></use></svg>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, playlistItems }) => ({ auth, playlistItems })

export default connect(mapStateToProps)(PlaylistItems)
