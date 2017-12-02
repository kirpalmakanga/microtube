import { h } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router'

import moment from 'moment'

import getThumbnails from '../../lib/getThumbnails'
import parseDuration from '../../lib/parseDuration'

import Img from '../Img'

const VideoCard = ({ videoId, title, thumbnails, publishedAt, duration, channelTitle, dispatch }) => (
  <div class='card shadow--2dp'>
    <div
      class='card__content'
      aria-label={`Play video ${title}`}
      onClick={() => dispatch({
        type: 'QUEUE_SET_ACTIVE_ITEM',
        data: { video: { videoId, title } }
      })}
    >
      <Img src={getThumbnails(thumbnails, 'high')} background />

      <div class='card__text'>
        <h2 class='card__text-title'>{title}</h2>
        <p class='card__text-subtitle channel'>{channelTitle}</p>
        <p class='card__text-subtitle date'>{moment(publishedAt).format('MMMM Do YYYY')}</p>
      </div>
      <div>{parseDuration(duration)}</div>
    </div>

    <div class='card__buttons'>
      <button
        class='card__button icon-button'
        aria-label={`Queue video ${title}`}
        onClick={() => dispatch({ type: 'QUEUE_PUSH', data: [{ videoId, title }] })}
      >
        <span class='icon'>
          <svg><use xlinkHref='#icon-playlist-add'></use></svg>
        </span>
      </button>
    </div>
  </div>
)

export default connect()(VideoCard)
