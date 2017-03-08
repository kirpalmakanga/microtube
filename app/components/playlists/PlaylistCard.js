// jshint esversion: 6, asi: true
// eslint-env es6



const { connect } = ReactRedux
import { getPlaylistItems, queuePlaylistItems } from '../../actions/database'

const PlaylistCard = ({ auth, id, title, dispatch }) => {
  function openPlaylist() {
    dispatch({
      type: 'PLAYLIST_OPEN',
      title
    })
    dispatch(getPlaylistItems(auth.token, id))
  }

  return (
    <div className='card shadow--2dp'>
      <div className='card__text' onClick={openPlaylist}>
        <h2 className='card__text-title'>{title}</h2>
        <p className='card__text-subtitle'></p>
      </div>

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
