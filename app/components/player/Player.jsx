import Button from './controls/Button.jsx'
import VolumeRange from './controls/VolumeRange.jsx'
import InfoTime from './controls/InfoTime.jsx'
import InfoTitle from './controls/InfoTitle.jsx'
import InfoProgress from './controls/InfoProgress.jsx'

import { setActiveQueueItem } from '../../actions/player'

const { connect } = ReactRedux

const Player = ({ player, dispatch }) => {
  const { queue, youtube, currentTime, duration, volume, loaded, isPlaying, isBuffering, isMuted, showQueue, newQueueItems, showScreen } = player
  const isYoutubeReady = (typeof youtube === 'object' && youtube !== null)

  const currentIndex = queue.findIndex(item => item.active)
  const currentVideo = queue[currentIndex] || {}

  function goTo(direction) {
    const index = currentIndex + (direction === 'next' ? 1 : -1)

    return () => {
      if(queue[index]) {
        dispatch({ type: 'CLEAR_WATCHERS' })
        dispatch({ type: 'RESET_TIME' })

        dispatch(setActiveQueueItem({ queue: queue, index}))
      }
    }
  }

  function playPause () {
    if (!isYoutubeReady || isBuffering ) {
      return
    }

    if (isPlaying) {
      youtube.pauseVideo()
    } else {
      youtube.playVideo()
    }

    dispatch({ type: isPlaying ? 'PAUSE' : 'PLAY' })
  }

  function setVideoTime ({ target }) {
    let newTime

    if (youtubeReady) {
      newTime = duration * (target.value / 100)
      youtube.seekTo(newTime)

      dispatch({ type: 'CLEAR_WATCHERS' })
      dispatch({
        type: 'UPDATE_TIME',
        data: { currentTime: newTime }
      })
    }
  }

  function setVolume(val) {
    youtube.setVolume(val)
    dispatch({
      type: 'SET_VOLUME',
      data: val
    })
  }

  function handleWheelVolume({ deltaY }) {
      let newVolume, inRange

      if (!isYoutubeReady) {
        return
      }

      newVolume =  deltaY < 0 ? volume + 5 : volume - 5
      inRange = newVolume >= 0 && newVolume <= 100

      if(isMuted) {
        youtube.unMute()
      }

      if (inRange) {
        setVolume(volume)
      }
  }

  function mute() {
    if (!youtubeReady) {
      return
    }

    if (isMuted) {
      youtube.unMute()
    } else {
      youtube.mute()
    }

    dispatch({ type: isMuted ? 'UNMUTE' : 'MUTE' })
  }

  return (
    <div className='player shadow--2dp'>
      <div className='player__controls'>
        <Button className='player__controls-button icon-button' onClick={goTo('prev')} icon='icon-skip-previous' />

        <Button
          className='player__controls-button icon-button'
          onClick={playPause}
          icon={isBuffering ? 'icon-loading' : isPlaying ? 'icon-pause' : 'icon-play' }
          iconTransitionClass={isBuffering ? 'rotating': ''}
        />

        <Button className='player__controls-button icon-button' onClick={goTo('next')} icon='icon-skip-next' />
      </div>

      <div className='player__info'>
        <InfoProgress percentElapsed={currentTime / duration} percentLoaded={loaded} />

        <InfoTitle title={currentVideo.title || 'No Video.'} currentTime={currentTime} duration={duration} />

        <InfoTime currentTime={currentTime} duration={duration} />

        <input
          className='player__info-progress-loaded'
          type='range'
          min='0'
          max='100'
          onChange={setVideoTime}
        />
      </div>

      <div className='player__controls'>
        <Button
          className={[
            'player__controls-button badge icon-button',
            showQueue ? 'is-active' : '',
            newQueueItems ? 'badge--active' : '',
          ].join(' ')}
          onClick={() => dispatch({ type: showQueue ? 'QUEUE_CLOSE' : 'QUEUE_OPEN' })}
          badge={newQueueItems}
          icon='icon-list'
        />

        <Button
          className={['player__controls-button icon-button', showScreen ? 'is-active' : ''].join(' ')}
          onClick={() => dispatch({ type: showScreen ? 'SCREEN_CLOSE' : 'SCREEN_OPEN' })}
          icon='icon-film'
        />

        <div
          className='player__controls-volume'
          onMouseEnter={() => dispatch({ type: 'OPEN_VOLUME' })}
          onMouseLeave={() => dispatch({ type: 'CLOSE_VOLUME' })}
          onWheel={handleWheelVolume}
        >
          <Button
            className='player__controls-button icon-button'
            onClick={mute}
            icon={
            isMuted ?
              'icon-volume-mute'
            : volume >= 50 ?
              'icon-volume-up'
            : volume > 0 && volume <= 50 ?
              'icon-volume-down'
            :
              'icon-volume-off'
            }
          />

          <VolumeRange value={volume} onChange={({ target }) => setVolume(target.value)} />
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ player }) => ({ player })

export default connect(mapStateToProps)(Player)
