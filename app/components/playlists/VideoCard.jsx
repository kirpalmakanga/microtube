import parseDuration from '../../lib/parseDuration'

const { connect } = ReactRedux

const VideoCard = ({ player, video, dispatch }) => {
  const { videoId, title, publishedAt, duration, channelTitle } = video

  const currentIndex = player.queue.reduce((result, item, i) => {
    if (player.video.videoId === item.videoId) {
      return i
    }
    return result
  }, 0)

  return (
    <div className='card shadow--2dp'>
      <div
        className='card__content'
        onClick={() => {
          dispatch({ type: 'CLEAR_WATCHERS' })

          dispatch({
            type: 'QUEUE_PUSH',
            data: {
              ...video,
              index: currentIndex + 1
            }
          })

          dispatch({
            type: 'PLAY',
            data: video,
            skip: true
          })
        }}
      >
        <div className='card__text'>
          <h2 className='card__text-title'>{title}</h2>
          <p className='card__text-subtitle channel'>{channelTitle}</p>
          <p className='card__text-subtitle date'>{moment(publishedAt).format('MMMM Do YYYY')}</p>
        </div>
        <div>{parseDuration(duration)}</div>
      </div>

      <div className='card__buttons'>
        <button
          className='card__button icon-button'
          onClick={() => dispatch({
            type: 'QUEUE_PUSH',
            data: video
          })}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-playlist-add'></use></svg>
          </span>
        </button>

        <button
          className='card__button icon-button'
          onClick={() => dispatch({
            type: 'QUEUE_PUSH',
            data: video
          })}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-queue'></use></svg>
          </span>
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect()(VideoCard)
