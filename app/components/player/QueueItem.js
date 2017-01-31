// jshint esversion: 6, asi: true
// eslint-env es6

import parseDuration from '../../lib/parseDuration'

const { connect } = ReactRedux

const QueueItem = ({ index, data, player, dispatch }) => {
  const isCurrentVideo = (player.video.videoId === data.videoId)
  return (
    <div className={['queue__item', isCurrentVideo ? 'queue__item--active' : ''].join(' ')}>
      <span className='queue__item-title'>{data.title}</span>

      <span className='queue__item-duration'>{parseDuration(data.duration)}</span>

      {!isCurrentVideo ? (
        <button
          className='queue__item-button'
          onClick={() => {
            dispatch({ type: 'CLEAR_WATCHERS' })

            dispatch({
              type: 'PLAY',
              data: item,
              skip: true
            })
          }}
        >
          <svg><use xlinkHref='#icon-play'></use></svg>
        </button>
      ) : null}

      <button
        className='queue__item-button'
        onClick={() => dispatch({
          type: 'QUEUE_REMOVE',
          index: i
        })}
      >
        <svg><use xlinkHref='#icon-close'></use></svg>
      </button>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(QueueItem)
