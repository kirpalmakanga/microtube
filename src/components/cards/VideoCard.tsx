import { h } from 'preact'
import { connect } from 'preact-redux'
import { Link } from 'preact-router'

import { formatDate, getThumbnails, parseDuration } from 'lib/helpers'

import Img from 'components/Img'
import Icon from 'components/Icon'

interface Props {
    videoId: String
    title: String
    thumbnails: Object
    publishedAt: String
    duration: Number
    channelTitle: String
    setAsActiveItem: Function
    pushToQueue: Function
}

interface DispatchFromProps {
    setAsActiveItem: Function
    pushToQueue: Function
}

const VideoCard = ({
    videoId,
    title,
    thumbnails,
    publishedAt,
    duration,
    channelTitle,
    setAsActiveItem,
    pushToQueue
}) => (
    <div class="card">
        <div
            class="card__content"
            aria-label={`Play video ${title}`}
            onClick={() => setAsActiveItem({ videoId, title, duration })}
        >
            <div class="card__thumb">
                <Img
                    src={getThumbnails(thumbnails, 'high')}
                    alt={title}
                    background
                />
                <span class="card__thumb-badge">{parseDuration(duration)}</span>
            </div>

            <div class="card__text">
                <h2 class="card__text-title">{title}</h2>
                <p class="card__text-subtitle channel">{channelTitle}</p>
                <p class="card__text-subtitle date">
                    {formatDate(publishedAt, 'MMMM Do YYYY')}
                </p>
            </div>
        </div>

        <div class="card__buttons">
            <button
                class="card__button icon-button"
                aria-label={`Queue video ${title}`}
                onClick={() => pushToQueue([{ videoId, title, duration }])}
            >
                <Icon name="playlist-add" />
            </button>
        </div>
    </div>
)

const mapDispatchToProps = (dispatch) => ({
    setAsActiveItem: (video) =>
        dispatch({
            type: 'QUEUE_SET_ACTIVE_ITEM',
            data: { video }
        }),

    pushToQueue: (data) => dispatch({ type: 'QUEUE_PUSH', data })
})

export default connect(() => ({}), mapDispatchToProps)(VideoCard)
