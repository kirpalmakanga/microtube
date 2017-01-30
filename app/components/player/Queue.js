// jshint esversion: 6, asi: true
// eslint-env es6

import parseDuration from '../../lib/parseDuration'

const { connect } = ReactRedux

const Queue = ({ player, dispatch }) => {
  return (
    <div className={['queue mdl-shadow--2dp', player.showQueue ? 'queue--show': ''].join(' ')}>
      {player.queue.map((item, i) => {
        const isCurrentVideo = (player.video.videoId === item.videoId)
        return (
          <div
            key={i}
            className={['queue__item', isCurrentVideo ? 'is-active' : ''].join(' ')}
          >
            <span className='queue__item-title'>{item.title}</span>

            <span>{parseDuration(item.duration)}</span>

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
                type: 'QUEUE_MOVE',
                index: i,
                direction: -1
              })}
            >
              <svg><use xlinkHref='#icon-up'></use></svg>
            </button>

            <button
              className='queue__item-button'
              onClick={() => dispatch({
                type: 'QUEUE_MOVE',
                index: i,
                direction: +1
              })}
            >
              <svg><use xlinkHref='#icon-down'></use></svg>
            </button>

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
      })}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    player: state.player
  }
}

export default connect(mapStateToProps)(Queue)
