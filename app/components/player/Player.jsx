import DocumentTitle from 'react-document-title'

import formatTime from '../../lib/formatTime'

import { setActiveQueueItem } from '../../actions/player'

const { connect } = ReactRedux

const noop = () => {}

const Player = ({ player, dispatch }) => {
  const currentIndex = player.queue.findIndex(item => item.active)
  const currentVideo = player.queue[currentIndex]

  const currentTime = player.currentTime
  const duration = player.duration

  const timeProgress = {
    transform: 'translateX(' + parseFloat((currentTime / duration * 100) - 100).toFixed(2) + '%)'
  }

  const loadProgress = {
    transform: 'translateX(' + parseFloat((player.loaded * 100) - 100).toFixed(2) + '%)'
  }

  const youtubeReady = (typeof player.youtube === 'object' && player.youtube !== null)

  function goTo(direction) {
    const index = currentIndex + (direction === 'next' ? 1 : -1)
    const video = player.queue[index]

    return () => {
      if(video) {
        dispatch({ type: 'CLEAR_WATCHERS' })
        dispatch({ type: 'RESET_TIME' })

        dispatch(setActiveQueueItem({ queue: player.queue, index}))
      }
    }
  }

  function getDocumentTitle () {
    let title = 'Youtube Lite'

    if (currentVideo) {
      title = [currentVideo.title, '-', formatTime(currentTime), '/', formatTime(duration)].join(' ')
    }
    return title
  }

  function playPause () {
    if (player.isPlaying) {
      player.youtube.pauseVideo()
    } else {
      player.youtube.playVideo()
    }

    dispatch({ type: player.isPlaying ? 'PAUSE' : 'PLAY' })
  }

  function setVolume(val) {
    player.youtube.setVolume(val)
    dispatch({
      type: 'SET_VOLUME',
      data: val
    })
  }

  function stopPropagation(e) {
    e.stopPropagation()
  }

  return (
    <div className='player shadow--2dp'>
      <div className='player__controls'>
        <button
          className='player__controls-button icon-button'
          onClick={goTo('prev')}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-skip-previous'></use></svg>
          </span>
        </button>

        <button
          className='player__controls-button icon-button'
          onClick={youtubeReady && !player.isBuffering ? playPause : noop}
        >
          <span className={['icon', player.isBuffering ? 'rotating': ''].join(' ')}>
            {player.isBuffering ? (
              <svg><use xlinkHref='#icon-loading'></use></svg>
            )
            : player.isPlaying ? (
              <svg><use xlinkHref='#icon-pause'></use></svg>
            ) : (
              <svg><use xlinkHref='#icon-play'></use></svg>
            )}
          </span>
        </button>

        <button
          className='player__controls-button icon-button'
          onClick={goTo('next')}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-skip-next'></use></svg>
          </span>
        </button>
      </div>

      <div className='player__info'>
        <div className='player__info-progress'>
          <div className='player__info-progress-gutter'>
            <div className='player__info-progress-loaded' style={loadProgress}></div>
            <div className='player__info-progress-played' style={timeProgress}></div>
          </div>
        </div>

        <DocumentTitle title={getDocumentTitle()}>
          <div className='player__info-title'>{currentVideo ? currentVideo.title : 'No video.'}</div>
        </DocumentTitle>

        <div className='player__info-time'>
          <span>{formatTime(currentTime)}</span>
          <span className="separator">/</span>
          <span>{formatTime(duration)}</span>
        </div>

        <input
          className='player__info-progress-loaded'
          type='range'
          min='0'
          max='100'
          onChange={youtubeReady ? ({target}) => {
            const newTime = duration * (target.value / 100)

            player.youtube.seekTo(newTime)

            dispatch({ type: 'CLEAR_WATCHERS' })
            dispatch({
              type: 'UPDATE_TIME',
              data: { currentTime: newTime }
            })
          } : noop}
        />
      </div>

      <div className='player__controls'>
        <button
          className={[
            'player__controls-button badge icon-button',
            player.showQueue ? 'is-active' : '',
            player.newQueueItems ? 'badge--active' : '',
          ].join(' ')}
          onClick={() => dispatch({ type: player.showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN' })}
          data-badge={player.newQueueItems}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-list'></use></svg>
          </span>
        </button>

        <button
          className={['player__controls-button icon-button', player.showScreen ? 'is-active' : ''].join(' ')}
          onClick={() => dispatch({ type: player.showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN' })}
        >
          <span className='icon'>
            <svg><use xlinkHref='#icon-film'></use></svg>
          </span>
        </button>

        <div
          className='player__controls-volume'
          onMouseEnter={() => dispatch({ type: 'OPEN_VOLUME' })}
          onMouseLeave={() => dispatch({ type: 'CLOSE_VOLUME' })}
          onWheel={youtubeReady ? ({ deltaY }) => {
              const volume =  deltaY < 0 ? player.volume + 5 : player.volume - 5
              const inRange = volume >= 0 && volume <= 100

              if(player.isMuted) {
                player.youtube.unMute()
              }

              if (inRange) {
                setVolume(volume)
              }
          } : noop}
        >
          <button
            className='player__controls-button icon-button'
            onClick={youtubeReady ? () => {
              if (player.isMuted) {
                player.youtube.unMute()
              } else {
                player.youtube.mute()
              }

              dispatch({ type: player.isMuted ? 'UNMUTE' : 'MUTE' })
            } : noop}
          >
            <span className='icon'>
              {player.isMuted ? (
                <svg><use xlinkHref='#icon-volume-mute'></use></svg>
              ) : player.volume >= 50 ? (
                <svg><use xlinkHref='#icon-volume-up'></use></svg>
              ) : player.volume > 0 && player.volume <= 50 ? (
                <svg><use xlinkHref='#icon-volume-down'></use></svg>
              ) : (
                <svg><use xlinkHref='#icon-volume-off'></use></svg>
              ) }
            </span>
          </button>

          <div className='player__controls-volume-range'>
            <input
              type='range'
              min='0'
              max='100'
              value={player.volume}
              onChange={({ target }) => setVolume(target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
