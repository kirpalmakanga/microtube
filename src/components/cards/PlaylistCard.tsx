import { h } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router'

import { queuePlaylist } from 'actions/youtube'
import { getThumbnails } from 'lib/helpers'

import Img from 'components/Img'
import Icon from 'components/Icon'

interface Props {
  id: String
  title: String
  thumbnails: Object
  itemCount: Number
  queuePlaylist: Function
  openPlaylist: Function
}

interface DispatchFromProps {
  queuePlaylist: Function
  openPlaylist: Function
}

const PlaylistCard = ({
  id,
  title,
  thumbnails,
  itemCount,
  queuePlaylist,
  openPlaylist
}) => (
  <div class="card shadow--2dp">
    <Link
      class="card__content"
      href={`/playlist/${id}`}
      onClick={() => openPlaylist(title)}
      aria-label={title}
    >
      <div class="card__thumb">
        <Img src={getThumbnails(thumbnails, 'high')} alt={title} background />
        <span class="card__thumb-badge">{`${itemCount} video${
          itemCount !== 1 ? 's' : ''
        }`}</span>
      </div>

      <div class="card__text">
        <h2 class="card__text-title">{title}</h2>
      </div>
    </Link>

    <div class="card__buttons">
      <button
        class="card__button icon-button"
        type="button"
        aria-label="Queue playlist"
        onClick={() =>
          queuePlaylist({
            playlistId: id
          })
        }
      >
        <Icon name="playlist-add" />
      </button>

      <button
        class="card__button icon-button"
        type="button"
        aria-label="Queue and play playlist"
        onClick={() =>
          queuePlaylist({
            playlistId: id,
            play: true
          })
        }
      >
        <Icon name="playlist-play" />
      </button>
    </div>
  </div>
)

const mapDispatchToProps = (dispatch) => ({
  queuePlaylist: (params) => dispatch(queuePlaylist(params)),
  openPlaylist: (data) => dispatch({ type: 'PLAYLIST_OPEN', data })
})

export default connect(() => ({}), mapDispatchToProps)(PlaylistCard)
