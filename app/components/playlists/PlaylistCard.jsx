import { Link } from 'react-router'
import Img from '../Img.jsx'
import { queuePlaylist } from '../../actions/database'
import getThumbnails from '../../lib/getThumbnails'

const { connect } = ReactRedux

const PlaylistCard = ({ auth, id, title, thumbnails, itemCount, player, dispatch }) => {
  function openPlaylist() {
    dispatch({
      type: 'PLAYLIST_OPEN',
      data: title
    })
  }

  return (
    <div className='card shadow--2dp'>
      <Link className='card__content' to={'/playlist/' + id} onClick={openPlaylist}>
        <Img src={getThumbnails(thumbnails)} background/>
        
        <div className='card__text'>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle nb-videos'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>

      <div className="card__buttons">
        <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylist({ token: auth.token, playlistId: id, queue: player.queue }))}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-playlist-add'></use></svg>
          </span>
        </button>

        <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylist({ token: auth.token, playlistId: id, queue: player.queue, play: true }))}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-playlist-play'></use></svg>
          </span>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth, player }) => ({ auth, player })

export default connect(mapStateToProps)(PlaylistCard)
