import { h } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router'

import { queuePlaylist } from '../../actions/database'
import getThumbnails from '../../lib/getThumbnails'

import Img from '../Img.jsx'

const PlaylistCard = ({ auth, id, title, thumbnails, itemCount, player, dispatch }) => (
  <div class='card shadow--2dp'>
    <Link
      class='card__content' href={'/playlist/' + id}
      onClick={() => dispatch({ type: 'PLAYLIST_OPEN', data: title })}
      aria-label={title}
    >
      <Img src={getThumbnails(thumbnails, 'high')} background/>

      <div class='card__text'>
        <h2 class='card__text-title'>{title}</h2>
        <p class='card__text-subtitle nb-videos'>{itemCount + ' Video' + (itemCount !== 1 ? 's' : '')}</p>
      </div>
    </Link>

    <div class="card__buttons">
      <button
        class='card__button icon-button'
        type='button'
        name='Queue playlist'
        onClick={() => dispatch(queuePlaylist({
          token: auth.token,
          playlistId: id
        }))}
      >
        <span class='icon'>
          <svg><use xlinkHref='#icon-playlist-add'></use></svg>
        </span>
      </button>

      <button
        class='card__button icon-button'
        type='button'
        aria-label='Queue and play playlist'
        onClick={() => dispatch(queuePlaylist({
          token: auth.token,
          playlistId: id,
          play: true
        }))}
      >
        <span class='icon'>
          <svg><use xlinkHref='#icon-playlist-play'></use></svg>
        </span>
      </button>
    </div>
  </div>
)

const mapStateToProps = ({ auth, player }) => ({ auth, player })

export default connect(mapStateToProps)(PlaylistCard)
