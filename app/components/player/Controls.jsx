import Button from './controls/Button.jsx'
import VolumeRange from './controls/VolumeRange.jsx'
import InfoTime from './controls/InfoTime.jsx'
import InfoTitle from './controls/InfoTitle.jsx'
import InfoProgress from './controls/InfoProgress.jsx'

const { connect } = ReactRedux

const Player = ({ player, info, togglePlay, toggleMute, goToVideo, setVolume, handleWheelVolume, setVideoTime, dispatch }) => {
  const { isPlaying, isBuffering, isMuted, volume, loaded, currentTime, duration, currentVideo = { title: 'No Video.' } } = info

  const { queue, showQueue, newQueueItems, showScreen } = player

  return (
    <div className='player shadow--2dp'>
      <div className='player__controls'>
        <Button
          className='player__controls-button icon-button'
          onClick={() => goToVideo(false)}
          icon='icon-skip-previous'
        />

        <Button
          className='player__controls-button icon-button'
          onClick={togglePlay}
          icon={isBuffering ? 'icon-loading' : isPlaying ? 'icon-pause' : 'icon-play' }
          iconTransitionClass={isBuffering ? 'rotating': ''}
        />

        <Button
          className='player__controls-button icon-button'
          onClick={() => goToVideo(true)}
          icon='icon-skip-next'
        />
      </div>

      <div className='player__info'>
        <InfoProgress percentElapsed={currentTime / duration} percentLoaded={loaded} />

        <InfoTitle title={currentVideo.title} currentTime={currentTime} duration={duration} />

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

        <div className='player__controls-volume' onWheel={handleWheelVolume}>
          <Button
            className='player__controls-button icon-button'
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
