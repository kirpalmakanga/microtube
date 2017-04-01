import { Link } from 'react-router'
import { queuePlaylistItems } from '../../actions/database'

const { connect } = ReactRedux

const PlaylistCard = ({ auth, id, title, itemCount, dispatch }) => {
  function openPlaylist() {
    dispatch({
      type: 'PLAYLIST_OPEN',
      data: {
        playlistId: id,
        playlistTitle: title
      }
    })
  }
  return (
    <div className='card shadow--2dp'>
      <Link className='card__text' to={'/playlist/' + id} onClick={openPlaylist}>
        <div>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>

      <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylistItems(auth.token, id))}>
        <span className='icon'>
          <svg><use xlinkHref='#icon-queue'></use></svg>
        </span>
      </button>

      <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylistItems(auth.token, id, true))}>
        <span className='icon'>
          <svg><use xlinkHref='#icon-play'></use></svg>
        </span>
      </button>
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PlaylistCard)
