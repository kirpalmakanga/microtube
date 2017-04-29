import { Link } from 'react-router'
import { queuePlaylistItems } from '../../actions/database'

const { connect } = ReactRedux

const PlaylistCard = ({ auth, id, title, itemCount, dispatch }) => {
  function openPlaylist() {
    dispatch({
      type: 'PLAYLIST_OPEN',
      data: title
    })
  }
  return (
    <div className='card shadow--2dp'>
      <Link className='card__content' to={'/playlist/' + id} onClick={openPlaylist}>
        <div className='card__text'>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle nb-videos'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
        </div>
      </Link>

      <div className="card__buttons">
        <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylistItems(auth.token, id))}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-queue'></use></svg>
          </span>
        </button>

        <button className='card__button icon-button' type='button' onClick={() => dispatch(queuePlaylistItems(auth.token, id, true))}>
          <span className='icon'>
            <svg><use xlinkHref='#icon-playlist-play'></use></svg>
          </span>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({ auth })

export default connect(mapStateToProps)(PlaylistCard)
