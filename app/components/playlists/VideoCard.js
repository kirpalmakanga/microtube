// jshint esversion: 6, asi: true
// eslint-env es6

import parseDuration from '../../lib/parseDuration'

const { connect } = ReactRedux

const VideoCard = ({ video, dispatch }) => {
  const { videoId, title, publishedAt, duration, channelTitle } = video

  return (
    <div className='card mdl-shadow--2dp'>
      <div className='card__text'>
        <div>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle'>{channelTitle}</p>
          <p className='card__text-subtitle'>{moment(publishedAt).format('MMMM Do YYYY')}</p>
        </div>
        <div>{parseDuration(duration)}</div>
      </div>

      <button
        className='card__button'
        onClick={() => dispatch({
          type: 'QUEUE_PUSH',
          data: video
        })}
      >
        <svg><use xlinkHref='#icon-queue'></use></svg>
      </button>

      <button
        className='card__button'
        onClick={() => {
          dispatch({ type: 'CLEAR_WATCHERS' })

          dispatch({
            type: 'QUEUE_PUSH',
            data: video
          })

          dispatch({
            type: 'PLAY',
            data: video,
            skip: true
          })
        }}
      >
        <svg><use xlinkHref='#icon-play'></use></svg>
      </button>
    </div>
  )
}

export default connect()(VideoCard)
